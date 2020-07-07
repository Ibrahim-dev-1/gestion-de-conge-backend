const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    grade: { type: String, required: true},
    agents: [
        {
            type: Schema.Types.ObjectId,
            rel: 'Agent'
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("Status", statusSchema)