const mongoose = require("mongoose");

const ProblemLogSchema = new mongoose.Schema({
    title:String,
    description:String,
    platform:String,
    hintResponse:String,
    timestamp:{
        type:Date,
        default:Date.now,
    }
});

module.exports = mongoose.model("ProblemLog", ProblemLogSchema);