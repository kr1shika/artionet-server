const Artwork=require("../model/artwork")

const findAll=async (req,res)=>{
    try{
        const artwork=await Artwork.find();
        res.status(200).json(artwork);
    }catch(e){
        res.json(e);
    }
}

const save=async(req,res)=>{
    try{
        const artwork=new Artwork(req.body);
        await artwork.save();
        res.status(201).json(artwork)
    }catch(e){
        res.json(e)
    }
}

const findById=async(req,res)=>{
    try{
        const artwork=await Artwork.findById(req.params.id);
        res.status(200).json(artwork)
    }catch (e) {
        res.json(e)
    }
}

const deleteById=async(req,res)=>{
    try{
        const artwork=await Artwork.findByIdAndDelete(req.params.id);
        res.status(200).json("Data deleted")
    }catch (e){
        res.json(e)
    }
}

const update=async(req,res)=>{
    try{
        const artwork=await Artwork.findByIdAndUpdate(req.params.id,req.body,{new:true});
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
