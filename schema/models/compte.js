const mongoose = require("mongoose");

const compteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    isCountLock: Boolean,
    password: { 
        type: String , 
        required: true 
    },
    agent: { 
        type: mongoose.Types.ObjectId, 
        rel: 'Agent'
    }

}, { timestamps: true});

module.exports = mongoose.model("Compte", compteSchema);