var express=require("express");
var mongoose =require("mongoose");
var session = require('express-session')

var adminCtrl = require("./controllers/adminCtrl.js");
var adminStudentCtrl = require("./controllers/adminStudentCtrl.js");
var adminCourseCtrl = require("./controllers/adminCourseCtrl.js");
var mainCtrl = require("./controllers/mainCtrl.js");

var app=express();

mongoose.connect('mongodb://localhost:27017/RegisterSystem');

app.use(session({
    secret: 'liuyang',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60*1000*20 }
  }));

app.set("view engine","ejs");


app.get("/admin",                   adminCtrl.showAdminDashboard);
app.get("/admin/report",            adminCtrl.showAdminReport);

app.get ("/admin/student",          adminStudentCtrl.showAdminStudent);
app.get ("/admin/student/import",   adminStudentCtrl.showAdminStudentImport);
app.post("/admin/student/import",   adminStudentCtrl.doAdminStudentImport);
app.get ("/student",                adminStudentCtrl.getAllStudents);
app.get ("/student/add",            adminStudentCtrl.showAddStudent);
app.post ("/student/add",           adminStudentCtrl.doAddStudent);
app.post ("/student/:sid",          adminStudentCtrl.updateStudent);
app.get ("/student/:sid",           adminStudentCtrl.showEditStudent);
app.put ("/student/:sid",           adminStudentCtrl.doCheckId);
app.delete ("/student/:sid",        adminStudentCtrl.deleteStudent);


app.get("/admin/course",            adminCourseCtrl.showAdminCourse);
app.get ("/admin/course/import",    adminCourseCtrl.showAdminCourseImport);
app.post("/admin/course/import",    adminCourseCtrl.doAdminCourseImport);
app.get ("/course",                 adminCourseCtrl.getAllCourse);
app.get ("/course/add",             adminCourseCtrl.showAddCourse);

app.post ("/course/add",            adminCourseCtrl.doAddCourse);
app.post ("/course/:sid",           adminCourseCtrl.updateCourse);
app.get ("/course/:sid",            adminCourseCtrl.showEditCourse);
app.put ("/course/:sid",            adminCourseCtrl.doCheckId);
app.delete ("/course/:sid",         adminCourseCtrl.deleteCourse);

app.get ("/login",                  mainCtrl.showLogin);
app.post ("/login",                 mainCtrl.doLogin);
app.get ("/",                       mainCtrl.showIndex);
app.get ("/logout",                 mainCtrl.doLogout);
app.get ("/changepwd",              mainCtrl.showChangepwd);
app.post ("/changepwd",             mainCtrl.doChangepwd);
app.get ("/checkStatus",            mainCtrl.checkSubscribe);



app.use(express.static("public"));

app.use(function(req,res){
    res.send("404 page not found..");
});

app.listen(3000);
console.log("server is running on port 3000..");