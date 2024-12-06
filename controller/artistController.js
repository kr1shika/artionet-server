const Artist=require("../model/artist")

const findAll=async (req,res)=>{
    try{
        const artist=await Artist.find();
        res.status(200).json(artist);
    }catch(e){
        res.json(e);
    }
}

const save=async(req,res)=>{
    try{ const {full_name,email,contact_no,address}=req.body;
            const artist=new Artist({
                full_name,
                email,contact_no,
                address, identification_img:req.file.originalname
                });
                await artist.save();
                res.status(200).json(artist);
            }catch(e){
                res.json(e);
  }
}


const findById=async(req,res)=>{
    try{
        const artist=await Artist.findById(req.params.id);
        res.status(200).json(artist)
    }catch (e) {
        res.json(e)
    }
}

const deleteById=async(req,res)=>{
    try{
        const artist=await Artist.findByIdAndDelete(req.params.id);
        res.status(200).json("Data deleted")
    }catch (e){
        res.json(e)
    }
}

const update=async(req,res)=>{
    try{
        const artist=await Artist.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(201).json("Data updated")
    }catch (e){
        res.json(e)
    }
}

module.exports={
    findAll,
    save,
    findById,
    deleteById,
    update
}
