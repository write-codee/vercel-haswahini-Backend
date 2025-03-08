
import jwt from 'jsonwebtoken';
import { User } from '../Models/UserSchema.js';
export const AuthCheck = async(req,res,next)=>
{
    try {
        const token = req.header("Authorization");
        if(!token)
        {
            return res.status(401).json({message:"Not Token Is Provide"});
        }
        const jwtToken = token.replace("Bearer","").trim();
        const isVerify =  jwt.verify(jwtToken,process.env.SECRET)
        const userData = await User.findById({_id:isVerify.id},{password:0})
        req.user = userData;        
        next(); 
    } catch (error) {
        
        return res.status(500).json({message:"Tokne is expires"});
        
    }
}
