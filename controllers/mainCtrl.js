var formidable = require('formidable');
var Student=require("../models/Student");
var crypto = require('crypto');
var Course=require("../models/Course");

exports.showLogin=function(req,res){
    res.render("login");
}

exports.doLogin=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) { 
        if(err){
            res.json({"results":-1});
            return;
        } 
        var sid = fields.sid;
        var password = fields.password;
        Student.find({"sid":sid},function(err,results){
            if(err){
                res.json({"results":-1});
                return;
            } 
            if(results.length==0){
                res.json({"results":-2});
                return;
            } 
            var initpwd = results[0].initpwd;
            if(initpwd){
                if(results[0].password==password){
                    req.session.login=true;
                    req.session.sid=sid;
                    req.session.name=results[0].name;
                    req.session.changedpwd=false;
                    res.json({"results":1});
                    return;
                }else{
                    res.json({"results":-3});
                    return;
                }
            }else{
                if(results[0].password==crypto.createHash('sha256').update(password).digest('hex')){
                    req.session.login=true;
                    req.session.sid=sid;
                    req.session.name=results[0].name;
                    req.session.changedpwd=true;
                    res.json({"results":1});
                    return;
                }else{
                    res.json({"results":-3});
                    return;
                }
            }
        })
    })
}

exports.showIndex=function(req,res){
    if(req.session.login != true){
        res.redirect("/login");
        return;
    }

    if(req.session.changedpwd==false){
        res.redirect("/changepwd");
        return;
    }

    Student.find({"sid":req.session.sid},function(err,data){
        var s = data[0];
        res.render("index",{
            "sid":req.session.sid,
            "name":s.name
        });
    })
}

exports.checkSubscribe=function(req,res){
    var results=[];
    Student.find({"sid":req.session.sid},function(err,students){

        var s=students[0];
        var courses=s.mycourses;

        var cidMapDayofweek={};
        var occupyWeek=[];
        console.log(courses[0]);
        Course.find({},function(err,courses){
            courses.forEach(function(item){
                console.log(item.cid + " " + item.name);
                if(courses.indexOf(item.cid) != -1){
                    console.log("aaaaaaaaaa");
                    cidMapDayofweek[item.cid]=item.dayofweek;
                    //occupyWeek.push(item.dayofweek);
                }else{
                    console.log("bbbbbbbbb");
                }
                //console.log(occupyWeek);
            });
            console.log(cidMapDayofweek);
            //res.json({"results":results});
        })
       
    })
}



exports.doLogout=function(req,res){
    req.session.login = false;
    req.session.sid = "";
    res.redirect("/login");
}



exports.showChangepwd=function(req,res){
    if(req.session.login != true){
        res.redirect("/login");
        return;
    };
    res.render("changepwd",{
        "sid":req.session.sid,
        "name":req.session.name,
        "showtip": !req.session.changedpwd
    });
}


exports.doChangepwd=function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) { 
        var pwd=fields.pwd;
        Student.find({"sid":req.session.sid},function(err,results){
            var s= results[0];
            s.initpwd=false;
            s.password=crypto.createHash('sha256').update(pwd).digest('hex');
            s.save();
            res.json({"results":1});
        })
    });
}