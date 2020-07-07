const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeCongeSchema = new Schema({
    nom: { type: String , required: true },
    nbrJrMax: { type: Number, required: true},
    conges: [
        {
            type: Schema.Types.ObjectId,
            rel: 'Conge'
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("TypeConge", typeCongeSchema)