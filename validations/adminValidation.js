const joi=require("joi");
const { emit } = require("nodemon");

const adminSchema= joi.object( {
    full_name:joi.string().required(),
    email:joi.string().email()
    
})

function adminValidation(req,res,next){
    const {full_name,email}=req.body;
    const {error}=adminSchema.validate({full_name, email});
    if (error){
       return res.json("Validation failed for reasons ")
    } 
    next()
}

module.exports=adminValidation;