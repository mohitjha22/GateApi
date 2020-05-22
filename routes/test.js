const mongoose = require('mongoose');
const express= require('express');
const router= express.Router();

////schema for subject collections in the db
const subjectSchema = new mongoose.Schema({ 
	Question: String,
	Option_A: String,
	Option_B: String,
	Option_C: String,
	Option_D: String,
	Gate_Year: String,
	Answer: String,
	Topic: String,
	Marks: String,
	Img: String
});

//schema for branch collections in the db
const branchSchema = new mongoose.Schema({ 
	subject:String
});


//to get the test questions of selected topics of a subject of a branch
router.post('/subject/topics',function(req,res){

	//async-await function
	async function getquestions(){

		const subject = req.body[0].data.subject;
 		const topics = req.body[0].data.topics;
 		//console.log(req.body[0].subject);
		//console.log(req.body[1]);

 		//try-catch to see if the model is already made.
 		let Sub;
 		try {
 			Sub = mongoose.model(subject);
 		} catch (error) {
 			Sub = mongoose.model(subject,subjectSchema,subject);
 		}

 		const info=[];

 		//collecting all questions of the given topics from a subject
 		for(let i=0;i<topics.length;i++){
 			const topic=topics[i];
 			
 			//to query db.
			const questions= await Sub.find({'Topic':topic}).sort({Gate_Year:1});

			for(let j=0;j<questions.length;j++){
				info.push(questions[j]);
			}

 		}

		//console.log(info);
		res.send(info);
	}
	getquestions();
});

//to get all the test questions of a year of a branch
router.get('/:branch/:year',function(req,res){

	//async-await function
	async function getTestQuestionsYearwise(){

		const branch = req.params.branch;
		const year = req.params.year;
		
		//try-catch to see if the model is already made.
		let Query;
		try {
			Query = mongoose.model(branch);
		} catch (error) {
			Query = mongoose.model(branch,branchSchema,branch);
		}

		//querying the db to get all subjects of the given branch
		const subjects= await Query.find();

		const info=[];

		//collecting all questions of the given year from all subjects
		for(let i=0;i<subjects.length;i++){
			const subject=subjects[i].subject;

			//try-catch to see if the model is already made.
			let Sub;
			try {
				Sub = mongoose.model(subject);
			} catch (error) {
				Sub = mongoose.model(subject,subjectSchema,subject);
			}

			//query db
			const questions=await Sub.find({'Gate_Year':year}).sort({Gate_Year:1});
			
			for(let j=0;j<questions.length;j++){
				info.push(questions[j]);
			}
		}

		//console.log(info);
		res.send(info);
	}

	getTestQuestionsYearwise();
});


//to get the test questions of all topics of a subject of a branch
router.get('/:subject',function(req,res){

	//async-await function
	async function getTestQuestionsSubjectwise(){
		
		const subject = req.params.subject;

		//try-catch to see if the model is already made.
		let Sub;
		try {
			Sub = mongoose.model(subject);
		} catch (error) {
			Sub = mongoose.model(subject,subjectSchema,subject);
		}

		//querying the db to get 25(1 marks) random questions of the given subject
		const questions1= await Sub.aggregate([{$match:{Marks:"1"}},{$sample:{size:25}}]);
		//querying the db to get 30(2 marks) random questions of the given subject
		const questions2= await Sub.aggregate([{$match:{Marks:"2"}},{$sample:{size:30}}]);

		const info=[];

		//pushing all questions in one array
		for(let i=0;i<questions1.length;i++){
			info.push(questions1[i]);
		}
		for(let i=0;i<questions2.length;i++){
			info.push(questions2[i]);
		}

		//console.log(info);
		res.send(info);
	}

	getTestQuestionsSubjectwise();
});



module.exports=router;