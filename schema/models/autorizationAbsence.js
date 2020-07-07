const mongoose = require("mongoose");


const autorisationAbsence = new mongoose.Schema({
    dateDebut: { type: String , required: true },
    dateFin: { type: String, required: true },
    commentaire: String,
    typeAbsence:{
        type: mongoose.Types.ObjectId,
        rel: 'TypeAbsence'
    },
    agent: {
        type: mongoose.Types.ObjectId,
        rel: 'Agent'
    }


}, { timestamps : true });


module.exports = mongoose.model("AutorisationAbsence", autorisationAbsence);