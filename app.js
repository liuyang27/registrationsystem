var express=require("express");
var mongoose =require("mongoose");
var session = require('express-session')

var adminCtrl = require("./controllers/adminCtrl.js");

var app=express();

mongoose.connect('mongodb://localhost:27017/RegisterSystem');

app.use(session({
    secret: 'liuyang',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }));

app.set("view engine","ejs");


app.get("/admin",adminCtrl.showAdminDashboard);
app.get ("/admin/student",          adminCtrl.showAdminStudent);
app.get ("/admin/student/import",   adminCtrl.showAdminStudentImport);
app.post("/admin/student/import",   adminCtrl.doAdminStudentImport);
app.get("/admin/course",            adminCtrl.showAdminCourse);
app.get("/admin/report",            adminCtrl.showAdminReport);

app.get ("/student",                adminCtrl.getAllStudents);
app.get ("/student/add",            adminCtrl.showAddStudent);
app.post ("/student/add",           adminCtrl.doAddStudent);
app.post ("/student/:sid",          adminCtrl.updateStudent);
app.get ("/student/:sid",           adminCtrl.showEditStudent);
app.put ("/student/:sid",           adminCtrl.doCheckId);
app.delete ("/student/:sid",        adminCtrl.deleteStudent);


app.use(express.static("public"));

app.use(function(req,res){
    res.send("404 page not found..");
});

app.listen(3000);
console.log("server is running on port 3000..");