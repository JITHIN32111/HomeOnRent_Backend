import mongoose  from 'mongoose'



const subscriptionSchema=new mongoose.Schema({
    sellerId:{
        type:String,
        required:true,
    },
    sellername:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }, plan:{
        type:String,
        required:true
    },
 
    verified:{type:Boolean,default:false}
},{timestamps:true})
export default mongoose.model("subscription",subscriptionSchema)