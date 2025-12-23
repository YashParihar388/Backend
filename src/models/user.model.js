import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';


const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    fullname:{
         type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    watchhistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    RefreshToken:{
        type:String
    }
},{timestamps:true})



userSchema.pre("save",async function(){
    if(!this.isModified("password")) return ;
    this.password=await bcrypt.hash(this.password,10);
    
})

userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken=function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.username

    },
    process.env.AccessToken,
    {
        expiresIn:process.env.Expiry
    }
)
}
userSchema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this._id,
       

    },
    process.env.RefreshToken,
    {
        expiresIn:process.env.ExpiryR
    }
)
}


export const User=mongoose.model("User",userSchema);