import geocoder from "../utils/geocoder.js";
import mongoose from "mongoose";
import opencage from "opencage-api-client";
const PropertySchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      city: String,
      streetName: String,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["4BHK", "3BHK", "2BHK"],
    },
    desc: {
      type: String,
      required: true,
      min: 6,
    },
    img: {
      type: [],
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    sqrmeters: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
    },
    status: {
      type: String,

      default: "pending",
    },
    furnishment: {
      type: String,
    },
    schedules: {
      type: [],
      default: [],
    },
    ownerDetailsViewed: {
      type: [],
      default: [],
    },
    enqueryDetails: {
      type: [],
      default: [],
    },
   
  },
  { timestamps: true }
);
PropertySchema.pre("save", async function (next) {
  try {
     const data = await opencage.geocode({ q: "Theresienhöhe 11, München" });

     if (data.status.code === 200 && data.results.length > 0) {
        const place = data.results[0];
        this.location = {
           type: "Point",
           coordinates: [place.geometry.lat, place.geometry.lng],
           formattedAddress: place.formatted,
           city: place.components.city,
           streetName: place.components.quarter,
        };
     } else {
        console.log("Status", data.status.message);
        console.log("total_results", data.total_results);
     }

     next();
  } catch (error) {
     console.log("Error", error.message);

     if (error.status.code === 402) {
        console.log("hit free trial daily limit");
     }

     next(error);
  }
});


export default mongoose.model("property", PropertySchema);
