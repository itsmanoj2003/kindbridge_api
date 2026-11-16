const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
    childId: {
        type: String,
        required: true
    },
    orphanageId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('adoptions', adoptionSchema);