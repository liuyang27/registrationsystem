var formidable = require('formidable');
var path=require("path");
var fs=require("fs");
var xlsx =require('node-xlsx');
var Student=require("../models/Student");


exports.showAdminStudent=function(req,res){
    res.render("admin/student",{
        page:"student"
    });
}

exports.showAdminStudentImport=function(req,res){
    res.render("admin/student/import",{
        page:"student"
    });
}

exports.doAdminStudentImport=function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        
        if(!files.studentexcel){
            res.send("please select a file to upload..");
            return;
        }

        //check file type
        if(path.extname(files.studentexcel.name)!=".xlsx"){
            //remove wrong type file
            fs.unlink('./'+files.studentexcel.path, (err) => {
                if (err) throw err;
                res.send('file type is wrong,file was deleted..');
              });
            return;
        }

        //read file
        var workSheetsFromFile=xlsx.parse('./'+files.studentexcel.path);
        for(var i=0;i<workSheetsFromFile.length;i++){
            if(
                workSheetsFromFile[i].data[0][0]!="ID" ||
                workSheetsFromFile[i].data[0][1]!="Name"
                ){
                    res.send("excel form hearder not correct,please check.");
                    return;
                }
        }

        //save data to mongodb
        Student.importStudent(workSheetsFromFile);
         res.send("uploaded ok");

    });
}

exports.getAllStudents=function(req,res){
	Student.find({},function(err,results){
		res.json({"results":results});
	})
}

exports.updateStudent=function(req,res){
    var sid=req.params.sid;
	if(!sid){
		return;
    }
    var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {

		Student.find({"sid":sid},function(err,results){
			if(results.length==0){
				res.json({"results":-1});
				return;
			}

            var s =results[0];
			s.name=fields.name;
			s.grade=fields.grade;
			s.password=fields.password;
			s.save(function(err){
				if(err){
					res.json({"results":-1});
				}else{
					res.json({"results":1});
				}
			});
		})
	})
}

exports.showEditStudent=function(req,res){
    var sid =parseInt(req.params.sid);

    Student.find({"sid":sid},function(err,results){
        if(results.length==0){
			res.send("ID NOT FOUND..");
			return;
		}
		res.render("admin/student/edit",{
            page:"student",
			info:results[0]
		});
    })
}


exports.showAddStudent=function(req,res){
    res.render('admin/student/add',{
        page:"student"
    });
}


exports.doCheckId=function(req,res){
    var sid=req.params.sid;
	Student.checkSid(sid,function(results){
		res.json({"results":results});
    })
    
}


exports.doAddStudent=function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
        console.log("aaaaaaaaaaa");
		Student.addStudent(fields,function(results){
			res.json({"results":results});
		});	
	})
}

exports.deleteStudent=function(req,res){
    var sid=req.params.sid;
    Student.find({"sid":sid},function(err,results){
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



