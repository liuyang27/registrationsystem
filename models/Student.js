var mongoose = require('mongoose');

var studentSchema= new mongoose.Schema({
    "sid":Number,
    "name":String,
    "grade":Number,
    "password":String,
    "initpwd": { type: Boolean,default:true}
});

studentSchema.statics.importStudent=function(workSheetsFile){
    var str="ABDEFGHJKLMNPQRTUVWXYZabdefghijkmnpqrsuvwxyz23456789!@#$%&";
    mongoose.connection.collection("students").drop(function(){
        for(var i=0;i<workSheetsFile.length;i++){
            for(var j=1;j<workSheetsFile[i].data.length;j++){
                var password="";
                for(var m=0;m<6;m++){
                    password +=str.charAt(parseInt(str.length * Math.random()));
                }
                var s = new Student({
                    "sid":workSheetsFile[i].data[j][0],
                    "name":workSheetsFile[i].data[j][1],
                    "grade":i+1,
                    "password": password
                });
                s.save();
            }
        }
    });   
}


var Student = mongoose.model("Student",studentSchema);

module.exports=Student;