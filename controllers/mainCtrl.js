var formidable = require('formidable');
var Student=require("../models/Student");
var crypto = require('crypto');
var Course=require("../models/Course");
var _= require("underscore");


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
                    req.session.grade=results[0].grade;
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
                    req.session.grade=results[0].grade;
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
            "name":s.name,
            "grade":req.session.grade,
        });
    })
}

exports.checkSubscribe=function(req,res){

    if(req.session.login!=true){
        res.redirect("/login");
        return;
    };

    var results={};
    Student.find({"sid":req.session.sid},function(err,students){

        var s=students[0];
        var my_courses=s.mycourses;
        var my_grade = s.grade;
        var occupyWeek=[];
 
        Course.find({},function(err,courses){
            courses.forEach(function(item){
                if(my_courses.indexOf(item.cid) != -1){
                    occupyWeek.push(item.dayofweek);
                }
            });

            courses.forEach(function(item){
                if(my_courses.indexOf(item.cid) != -1){
                    results[item.cid] = "Already Registed";
                }else if(occupyWeek.indexOf(item.dayofweek) != -1){
                    results[item.cid] = "Day Conflict";
                }else if(item.number<=0){
                    results[item.cid] = "Full";
                }else if(item.allow.indexOf(my_grade) == -1 ){
                    results[item.cid] = "Year Limited";
                }else if(occupyWeek.length==2){
                    results[item.cid] = "Reach Max 2 Courses";
                }else{
                    results[item.cid] = "Register";
                }
            });

            res.json(results);
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

exports.register=function(req,res){
    var sid=req.session.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) { 
        var cid=fields.cid;

        Student.find({"sid":sid},function(err,students){
            students[0].mycourses.push(cid);
            students[0].save(function(){
                Course.find({"cid":cid},function(err,courses){
                    courses[0].mystudents.push(sid);
                    courses[0].number --;
                    courses[0].save(function(){
                        res.json({"result":1});
                    })
                })
            })
        });
    });
}


exports.unregister=function(req,res){
    var sid=req.session.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) { 
        var cid=fields.cid;
        Student.find({"sid":sid},function(err,students){
    
            var mycourses = students[0].mycourses;

            mycourses.forEach(function(item, index, arr) {
                if(item == cid) {
                    arr.splice(index, 1);
                }
            });
            students[0].mycourses=mycourses;
            students[0].save(function(){
                Course.find({"cid":cid},function(err,courses){
                    courses[0].mystudents=_.without( courses[0].mystudents,sid);
                    courses[0].number ++;
                    courses[0].save(function(){
                        res.json({"result":1});
                    })
                })
            })
        });
    });
}