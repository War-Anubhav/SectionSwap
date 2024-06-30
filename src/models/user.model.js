import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
        trim:true,
        index:true,
    },
    wantSection: [{
        type:String,
        required:true
    }],
    haveSection: {
        type:String,
        required:true
    },
    phoneNumber:{
        required:true,
        type:Number,
    },
},{timestamps:true})


export const User = mongoose.model("User", userSchema)