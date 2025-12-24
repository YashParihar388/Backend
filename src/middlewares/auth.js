import { asynchandler } from "../utils/asynchandler";
import { apierror } from "../utils/apierror";
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js"


export const verifyJWT = asynchandler(async(req,__dirname,next) =>{
    try {
        const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ","");

     // console.log(token);
        if (!token) {
            throw new apierror(401, "Unauthorized request")
        }

         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

          const user = await User.findById(decodedToken?._id).select("-password -RefreshToken")

          if (!user) {
            
            throw new apierror(401, "Invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
         throw new apierror(401, error?.message || "Invalid access token")
    }

    
})