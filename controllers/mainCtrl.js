var formidable = require('formidable');
var Student=require("../models/Student");


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
                    res.json({"results":1});
                    return;
                }else{
                    res.json({"results":-3});
                    return;
                }
            }else{

            }
        })
    })
}

exports.showTable=function(req,res){
    if(req.session.login != true){
        res.redirect("/login");
        return;
    }
    res.send("this is registration form...");
}