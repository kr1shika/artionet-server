const Purchase=require("../model/purchase")

const findAll=async (req,res)=>{
    try{
        const purchase=await Purchase.find().populate(["art_id","buyer_id"]);
        res.status(200).json(purchase);
    }catch(e){
        res.json(e);
    }
}

const save=async(req,res)=>{
    try{
        const purchase=new Purchase(req.body);
        await purchase.save();
        res.status(201).json(purchase)
    }catch(e){
        res.json(e)
    }
}

module.exports={
    findAll,
    save,
}
