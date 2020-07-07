const mongoose = require("mongoose");


const jourFerierSchema = new mongoose.Schema({
    date:{
        type: String,
        required: true
    },
    conges: [
        {
            type: mongoose.Types.ObjectId,
            rel: 'Conge'
        }
    ]

}, { timestamps : true });


module.exports = mongoose.model("JourFerier", jourFerierSchema);