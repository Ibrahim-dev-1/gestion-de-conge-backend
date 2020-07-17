const mongoose = require("mongoose");
const Division = require("./division");
const Conge = require("./conge");
const AutorisationAbsence = require("./autorizationAbsence");

const agentSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fonction: {
        type: String,
        required: true
    },
    situationMatrimoniale: {
        type: String,
        required: true
    },
    sexe: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    dateNaissance: {
        type: String,
        required: true
    },
    dateEmbauche: {
        type: String,
        required: true
    },
    status:{
        type: mongoose.Types.ObjectId,
        rel: 'Status'
    },
    calendrier: {
        type: mongoose.Types.ObjectId,
        rel: 'Calendrier'
    },
    compte: {
        type: mongoose.Types.ObjectId,
        rel: 'Compte'
    },
    division: {
        type: mongoose.Types.ObjectId,
        rel: 'Division'
    },
    autorisationAbsences: [
        {
            type: mongoose.Types.ObjectId,
            rel: 'AutorisationAbsence'
        }
    ],
    conges: [
        {
            type: mongoose.Types.ObjectId,
            rel: 'Conge'
        }
    ],


}, { timestamps : true });

agentSchema.pre("remove", async function(next){
    try{
        await Conge.remove({ "_id": { $in: this.conges}})
        await AutorisationAbsence.remove({ "_id": { $in: this.autorisationAbsences}})
        next();
    }catch(err){ 
        throw err;
    }
});

module.exports = mongoose.model("Agent", agentSchema);