const Buyer=require("../model/buyer")

const findAll=async (req,res)=>{
    try{
        const buyer=await Buyer.find();
        res.status(200).json(buyer);
    }catch(e){
        res.json(e);
    }
}

const save=async(req,res)=>{
    try{
        const buyer=new Buyer(req.body);
        await buyer.save();
        res.status(201).json(buyer)
    }catch(e){
        res.json(e)
    }
}

const findById=async(req,res)=>{
    try{
        const buyer=await Buyer.findById(req.params.id);
        res.status(200).json(buyer)
    }catch (e) {
        res.json(e)
    }
}

const deleteById=async(req,res)=>{
    try{
        const buyer=await Buyer.findByIdAndDelete(req.params.id);
        res.status(200).json("Data deleted")
    }catch (e){
        res.json(e)
    }
}

const update=async(req,res)=>{
    try{
        const buyer=await Buyer.findByIdAndUpdate(req.params.id,req.body,{new:true});
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
