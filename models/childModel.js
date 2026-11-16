import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({

    childName: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    moleLocation: {
        type: String,
        required:true,
        default: ''
    },

    scarLocation: {
        type: String,
        required:true,
        default: ''
    },

    otherIdentityMarks: {
        type: String,
        required:true,
        default: ''
    },

    orphanageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orhpanages',
        required: true
    }

}, { timestamps: true });

const childModel = mongoose.model('children', childSchema);

export default childModel;