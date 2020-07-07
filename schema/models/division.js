const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const divisionSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    agents:[
        {
            type: mongoose.Types.ObjectId,
            rel: 'Agent'
        }
    ]
},{timestamps: true})

module.exports = mongoose.model("Division", divisionSchema);