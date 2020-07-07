const mongoose = require("mongoose");


const congeSchema = new mongoose.Schema({
    dateDebut: { type: String , required: true },
    dateFin: { type: String, required: true },
    commentaire: String,
    typeConge:{
        type: mongoose.Types.ObjectId,
        rel: 'TypeConge'
    },
    agent: {
        type: mongoose.Types.ObjectId,
        rel: 'Agent'
    }


}, { timestamps : true });


module.exports = mongoose.model("Conge", congeSchema);