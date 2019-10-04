var formidable = require('formidable');
var path=require("path");
var fs=require("fs");
var xlsx =require('node-xlsx');
var Student=require("../models/Student");


exports.showAdminDashboard=function(req,res){
    res.render("admin/index",{
        page:"index"
    });
}

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


exports.showAdminCourse=function(req,res){
    res.render("admin/course",{
        page:"course"
    });
}

exports.showAdminReport=function(req,res){
    res.render("admin/report",{
        page:"report"
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
                workSheetsFromFile[0].data[0][0]!="ID" ||
                workSheetsFromFile[0].data[0][1]!="Name"
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
    
}


