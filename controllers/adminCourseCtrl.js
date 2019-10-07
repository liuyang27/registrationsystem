var formidable = require('formidable');
var fs=require("fs");
var Course=require("../models/Course");
var mongoose = require('mongoose');

exports.showAdminCourse=function(req,res){
    res.render("admin/course",{
        page:"course"
    });
}

exports.showAdminCourseImport=function(req,res){
    res.render("admin/course/import",{
        page:"course"
    });
}



exports.showEditCourse=function(req,res){
    var cid =parseInt(req.params.sid);
    Course.find({"cid":cid},function(err,results){
        if(results.length==0){
			res.send("ID NOT FOUND..");
			return;
        }
		res.render("admin/course/edit",{
            page:"course",
			info:results[0]
		});
    })

}
exports.showAddCourse=function(req,res){
    res.render('admin/course/add',{
        page:"course"
    });
}


exports.doAdminCourseImport=function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {  
        fs.readFile(files.courseJson.path,function(err,data){
            if(err){
                res.send("upload error..please check...");
                return;
            }
            var dataobj =JSON.parse(data.toString());
            mongoose.connection.collection("courses").drop(function(){
                Course.insertMany(dataobj.courses,function(err,r){
                    if(err){
                        res.send("upload error..");
                        return;
                    }
                    res.send("upload "+ r.length +" records successful.");
                });
            })
        })
    });
}

exports.getAllCourse=function(req,res){
	Course.find({},function(err,results){
		res.json({"results":results});
	})
}

exports.doCheckId=function(req,res){
    var sid=req.params.sid;
	Course.checkSid(sid,function(results){
		res.json({"results":results});
    })
    
}

exports.doAddCourse=function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		Course.addCourse(fields,function(results){
			res.json({"results":results});
		});	
	})
}

exports.deleteCourse=function(req,res){
    var cid=req.params.sid;
    Course.find({"cid":cid},function(err,results){
		if(err || results.length==0){
			res.json({"results":-1});
			return;
		}
		results[0].remove(function(err){
			if(err){
				res.json({"results":-1});
				return;
			}
			res.json({"results":1});
		})
	})
}


exports.updateCourse=function(req,res){
    var sid=req.params.sid;
	if(!sid){
		return;
    }
    var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {

		Course.find({"cid":sid},function(err,results){
			if(results.length==0){
				res.json({"results":-1});
				return;
			}

            var c =results[0];
			c.name=fields.name;
			c.dayofweek=fields.dayofweek;
            c.number=fields.number;
            c.allow=fields.allow;
            c.teacher=fields.teacher;
            c.briefintro=fields.briefintro;

			c.save(function(err){
				if(err){
					res.json({"results":-1});
				}else{
					res.json({"results":1});
				}
			});
		})
	})
}