const mongoose=require("mongoose");

const artworkSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    dimensions:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    price:{
        type:String,
        required: true
    },
    medium_used:{
        type:String,
        required: true
    },
    images:{
        type:String,
        required: false
    },
})

const Artworks=mongoose.model("Artworks", artworkSchema);
module.exports=Artworks;