const jwt=require("jsonwebtoken")
const SECRET_KEY="e4e62304e3bc88a53858dcf50b7a60e9662fc78015e27237eb93da4386df9449";

function authenticateToken(req,res,next){
    const token=req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).send("Access denied: No token provided");
    }
    try{
        const verified=jwt.verify(token,SECRET_KEY)
        req.user=verified;
        next()
    }catch(e){
        res.status(400).send("Invalid token")
    }
}

function authorizeRole(role){
    return (req,res,next)=>{
        if (req.user,role!==role){
            return res.status(403).send("Access Denied:Insufficient Permissions")
        }
        next();
    }
}

module.exports = {authenticateToken,authorizeRole}
