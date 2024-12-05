const mongoose=require("mongoose");

const buyerSchema = new mongoose.Schema ({
    full_name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact_no:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    },
    
})

const Buyer=mongoose.model("Buyers", buyerSchema);
module.exports=Buyer;