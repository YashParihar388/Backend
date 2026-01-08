import mongoose,{Schema} from 'mongoose';



const subscription = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

export const Subs =mongoose.model("Subs",subscription)