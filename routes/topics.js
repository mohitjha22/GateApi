const express= require('express');
const router= express.Router();
const mongoose = require('mongoose');

//schema for subject collections in the db
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

//to get the topics of a subject of a particular branch
router.get('/:subject',function(req,res){

	//async-await fuction
	async function getTopics(){

		const subject=req.params.subject;

		//try-catch to see if the model is already made.
		let Query;
		try {
			Query = mongoose.model(subject);
		} catch (error) {
			Query = mongoose.model(subject,subjectSchema,subject);
		}

		//querying the db
		const info= await Query.distinct("Topic");

		//converting the array into json array.
		const json=[];
		for(let i=0;i<info.length;i++){
			var text = '{ "topic": "'+info[i]+'"}';
			json.push(JSON.parse(text));
		}

		res.send(json);
		//console.log(info);

	}

	getTopics();
});

module.exports=router;