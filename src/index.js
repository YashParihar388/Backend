import "dotenv/config";
import dotenv from "dotenv"
import connectDb from "./db/index.js"

import { app } from "./app.js";



dotenv.config({path : './'})





connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });


// (async()=>{
//     try {
//         const dbconnect=mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     } catch (error) {
//         console.error(error);
//     }
// })()