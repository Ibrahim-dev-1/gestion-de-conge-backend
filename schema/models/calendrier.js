const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendrierSchema = new Schema({
    dateDebut: {
        type: String,
        required: true
    },
    dateFin: {
        type: String,
        required: true
    },
    nbrJr: {
        type: Number,
        required: true
    },
    agents:[
        {
            type: mongoose.Types.ObjectId,
            rel: 'Agent'
        }
    ]
},{timestamps: true})

module.exports = mongoose.model("Calendrier", calendrierSchema);