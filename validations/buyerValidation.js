const joi=require("joi");
const { emit } = require("nodemon");

const buyerSchema= joi.object( {
    full_name:joi.string().required(),
    email:joi.string().email(),
    contact_no:joi.string().required(),
    address:joi.string().required()
})

function buyerValidation(req,res,next){
    const {full_name,email,contact_no,address}=req.body;
    const {error}=buyerSchema.validate({full_name, email, contact_no,address});
    if (error){
       return res.json("Validation failed for reasons ")
    } 
    next()
}

module.exports=buyerValidation;


