import mongoose from "mongoose"

var userSchema = new mongoose.Schema({
    userName:{
        type:String,
        require:true
    },

    age:{
        type:Number,
        require:true
    },

    mobileNumber:{
        type:Number,
        require:true
    },

    maritalStatus:{
        type:String,
        require:true
    },

    gender:{
        type:String,
        require:true
    },

    companionName:{
        type:String,
    },

    aadharNumber:{
        type:Number,
        require:true
    },

    email:{
        type:String,
        require:true
    },

    password:{
        type:String,
        require:true
    },

    isVerified:{
        type:Boolean,
        default:false
    }

}, { timestamps: true })

const userModel = mongoose.model('Users',userSchema)

export default userModel