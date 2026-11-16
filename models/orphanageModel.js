import mongoose from 'mongoose'

var orphanageSchema = new mongoose.Schema({
    cciRegistrationnumber:{
        type:String,
        unique: true,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    districtCode:{
        type:Number,
        required:true
    },
    institutionCode:{
        type:String,
        required:true
    },
    institutionType:{
        type:String,
        required:true
    },
    managingAuthority:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    approvalStatus:{
        type:Boolean,
        default:true,
    }
})

const orphanageModel = mongoose.model('orhpanages',orphanageSchema)

export default orphanageModel;