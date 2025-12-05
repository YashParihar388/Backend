import "dotenv/config";
import mongoose from "mongoose";
import dotenv from "dotenv"
import connectDb from "./db/index.js"
import express from 'express'



dotenv.config({path : './'})



connectDb()
.then(app.listen(process.env.PORT || 3000),()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
.catch((error)=>{
    console.log("error in mongodb connection",error)
});


// (async()=>{
//     try {
//         const dbconnect=mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.error(error);
//     }
// })()