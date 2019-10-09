var mongoose = require('mongoose');

var courseSchema= new mongoose.Schema({
    "cid"       :String,
    "name"      :String,
    "dayofweek" :String,
    "number"    :Number,
    "allow"     :[String],
    "teacher"   :String,
	"briefintro":String,
	"mystudents":[String]
});

courseSchema.statics.checkSid=function(cid,callback){
	this.find({"cid":cid},function(err,res){
		callback(res.length==0);
	})
}

courseSchema.statics.addCourse=function(json,callback){
	console.log(json);
	Course.checkSid(json.sid,function(torf){
		if(torf){
			var s = new Course(json);
			s.save(function(err){
				if(err){
					callback("-2");
					return;
				}
				callback("1");
			});
		}else{
			callback("-1");
		}
	})
}

var Course = mongoose.model("Course",courseSchema);

module.exports=Course;