import {asynchandler} from '../utils/asynchandler.js'
import {apierror} from '../utils/apierror.js'
import {User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'


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
        $or: [{username},{password}]
    })
    //check if user is in database or not 
    if(existuser){
        throw new apierror(409,"user already exists")
    }


   const avatar= req.files?.avatar?.[0]?.path
   const cover = req.files?.coverImage?.[0]?.path

   if(!avatar){
    throw new apierror("upload avatar")
   }

   const uavatar=await uploadOnCloudinary(avatar)
   const ucover = await uploadOnCloudinary(cover)

   if(!uavatar){
    throw new apierror(404,'avatar image not uploaded')
   }

 const user = await User.create({
    username:username.toLowerCase(),
    fullname,
    email,
    password,
    avatar:avatar.url,
    coverImage:coverImage?.url || ""

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


export {registerUser}