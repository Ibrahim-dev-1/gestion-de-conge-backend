const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeAbsenceSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    nbrJrMax: Number,
    absences:[
        {
            type: mongoose.Types.ObjectId,
            rel: 'AutorisationAbsence'
        }
    ]
},{timestamps: true})

module.exports = mongoose.model("TypeAbsence", typeAbsenceSchema);