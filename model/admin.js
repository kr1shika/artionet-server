const mongoose=require("mongoose");

const adminSchema = new mongoose.Schema ({
    full_name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },

})

const Admin=mongoose.model("admins", adminSchema);
module.exports=Admin;