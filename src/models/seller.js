import mongoose  from 'mongoose'



const SellerSchema=new mongoose.Schema({
    sellername:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    phone:{
        type:Number,
        required:true
    },
    maxProperties:{
        type:Number,
        required:true,
        default:0
    },
 
    verified:{type:Boolean,default:false}
},{timestamps:true})
export default mongoose.model("seller",SellerSchema)