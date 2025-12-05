import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connectDb = async() =>{
    try {
        const DB=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`database connected `)
    } catch (error) {
        console.log("mongo connection failed",error);
        process.exit(1);
    }
}

export default connectDb;