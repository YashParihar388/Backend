import {asynchandler} from '../utils/asynchandler.js'
import {apierror} from '../utils/apierror.js'
import {User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { Jwt } from 'jsonwebtoken'



const generateAccessToken= async(userId) => {

    try {
        const user = await User.findById(userId)
        const AccessToken= user.generateAccessToken();
        const RefreshToken=user.generateRefreshToken();

        user.RefreshToken = RefreshToken;
        user.save({validateBeforeSave: false});

        return{AccessToken,RefreshToken}
    } catch (error) {
        throw new apierror(500,"Something went wrong while generating refresh and acc token");
    }

}



const registerUser = asynchandler(async (req,res) => {
    const {username ,password,email,fullname} = req.body;


    //checking if all inputs are correct
    if(
        [fullname,email,username,password].some((field)=>
            field?.trim() === ""
        )
    ){
        throw new apierror(404,'all fields are required')
    }

    //storing user
    const existuser = await User.findOne({
        $or: [{username},{email}]
    })
    //check if user is in database or not 
    if(existuser){
        throw new apierror(409,"user already exists")
    }


   const avatar= req.files?.avatar?.[0]?.path
   const coverImage = req.files?.coverImage?.[0]?.path

   if(!avatar){
    throw new apierror("upload avatar")
   }

   const uavatar=await uploadOnCloudinary(avatar)
   const ucover = await uploadOnCloudinary(coverImage)

   if(!uavatar){
    throw new apierror(404,'avatar image not uploaded')
   }

 const user = await User.create({
    username:username.toLowerCase(),
    fullname,
    email,
    password,
    avatar:uavatar.url,
    coverImage:ucover?.url || ""

 })

 const createduser=await User.findById(user._id).select(
    "-password -RefreshToken"
 )

 if(!createduser){
    throw new apierror
 }
 return res.status(201).json(
    new ApiResponse(200,createduser,"User registered successfully")
 )




})


const loginUser = asynchandler(async(req,res) =>{
    const {username,password,email} = req.body;
    

    if(!username && !email){
        throw new apierror(404,"please provide username or email");
    }

   const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new apierror(404,"user does not exists")
    }

    const validpassword = user.isPasswordCorrect(password);

    if(!validpassword){
        throw new apierror(404,"incorrect password");
    }

    const {RefreshToken,AccessToken} = await generateAccessToken(user._id);

    const loggedinuser = await User.findById(user._id).select("-password -RefreshToken");


    const options={
        httpOnly:true,
        secure:false
    }

    return res.status(200).
    cookie("AccessToken", AccessToken, options).
    cookie("RefreshToken",RefreshToken,options).
    json(
        new ApiResponse(
            200,
            {
            user:loggedinuser,RefreshToken,AccessToken
            },
            "User logged in successfully"
        )
    )

    
})

const logoutUser = asynchandler(async(req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                RefreshToken: undefined
            }
        },{
            new:true
        })

        const options={
            httpOnly:true,
            secure:false
        }

        return res.status(200)
        .clearCookie("RefreshToken",options)
        .clearCookie("AccessToken",options)
        .json(
            new ApiResponse(200,{},"user logged out")
        )
})

const refreshAccessToken = asynchandler(async (req,res) =>{
    const incomingToken = req.cookies.RefreshToken || req.body.RefreshToken;

    if(!incomingToken){
        throw new apierror(404,"session expired")
    }

    const decodedToken = await Jwt.verify(incomingToken,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new apierror("invalid refresh tokken")
    }

    if(incomingToken!==user.RefreshToken){
        throw new apierror("Refresh token is expired or used")
    }
    const options ={
        httpOnly:true,
        secure:false
    }

    const {AccessToken,newRefreshToken} =await generateAccessToken(user._id)

    return res.status(200)
    .cookie("AccessToken",AccessToken,options)
    .cookie("RefreshToken",newRefreshToken,options)
    .json(new ApiResponse(200,{AccessToken,RefreshToken:newRefreshToken},"Access Token Refreshed"))
})


export {registerUser,loginUser,logoutUser,refreshAccessToken};