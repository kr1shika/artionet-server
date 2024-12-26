const mongoose=require("mongoose");

const saveSchema = new mongoose.Schema({
    art_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Artworks"
    },
    buyer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    status:{
        type:String,
        required: true
    },
})

const Save=mongoose.model("Saves", saveSchema);
module.exports=Save;