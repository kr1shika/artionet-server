const Admin=require("../model/admin")

const findAll=async (req,res)=>{
    try{
        const admin=await Admin.find();
        res.status(200).json(admin);
    }catch(e){
        res.json(e);
    }
}

const save=async(req,res)=>{
    try{
        const admin=new Admin(req.body);
        await admin.save();
        res.status(201).json(admin)
    }catch(e){
        res.json(e)
    }
}

const findById=async(req,res)=>{
    try{
        const admin=await Admin.findById(req.params.id);
        res.status(200).json(admin)
    }catch (e) {
        res.json(e)
    }
}

module.exports= {
    findAll,
    save,
    findById
}