import geocoder from '../utils/geocoder.js'
import mongoose from "mongoose"

const PropertySchema=new mongoose.Schema({
    location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        city:String,
        streetName:String
      },
title:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String,
        required:true,
        enum:["4BHK","3BHK","2BHK"]
    },
    desc:{
        type:String,
        required:true,
        min:6
    },
    img:{
        type:[],
        default:""

    },
    price:{
        type:Number,
        required:true
    },
    sqrmeters:{
        type:Number,
        required:true,
       
    },
    address:{
        type:String,
        required:true,
    },
    featured:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true
    },
    name:{
        type:String,
       
    },status:{
        type:String,
       
        default:"pending"
    },furnishment:{
        type:String,
       
    },
    schedules: {
        type: [],
        default: []
      },
      ownerDetailsViewed: {
        type: [],
        default: []
      },
      enqueryDetails: {
        type: [],
        default: []
      },location:{
        type:String
      }
      
},{timestamps:true})
// PropertySchema.pre('save',async function(next){
//     const loc=await geocoder.geocode(this.address)
//     this.location={
//         type: 'Point',
//         coordinates: [loc[0].longitude, loc[0].latitude],
//         formattedAddress: loc[0].formattedAddress,
//         city:loc[0].city,
//         streetName:loc[0].streetName
//     }
// })


export default mongoose.model("property",PropertySchema)