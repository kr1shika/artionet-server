const mongoose=require("mongoose");

const artistSchema = new mongoose.Schema ({

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
    identification_img:{
        type:String,
        required: false
    },
    address:{
        type:String,
        required: true
    },
    preview_img:{
        type:String,
        required: false
    },
    artist_name:{
        type: String,
        required:false
    }, 
    password:{
        type:String,
        required:true
    },

})

const Artist=mongoose.model("artists", artistSchema);
module.exports=Artist;