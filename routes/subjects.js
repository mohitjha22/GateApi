var express = require('express');
var mongoose=require('mongoose');


var router = express.Router();

router.get('/',(req,res)=>{
    res.send('subject route')
})

//schema for branch collections in the db
const branchSchema = new mongoose.Schema({ 
	subject:String
});


router.get('/:branch',function(req,res){

	//async-await fuction
	async function getSubjects(){

		const branch=req.params.branch;
		//console.log(branch);

		//try-catch to see if the model is already made.
		let Query;
		try {
			Query = mongoose.model(branch);
		} catch (error) {
            console.log('no schema');
			Query = mongoose.model(branch,branchSchema,branch);
		}
		//querying the db
		const info= await Query.find();

		res.send(info);
		//console.log(info);

	}

	getSubjects();
});


module.exports=router;