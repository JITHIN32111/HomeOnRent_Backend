import mongoose  from 'mongoose'



const userSchema=new mongoose.Schema({
   
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
  
 
    verified:{type:Boolean,default:false}
},{timestamps:true})
export default mongoose.model("user",userSchema)