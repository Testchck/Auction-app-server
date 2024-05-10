const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    Team_name : String,
    Place : String,
    Phone : String,
    Team_manager : String,
    Wallet : Number
})

const teamModel = mongoose.model("Teams", TeamSchema);

module.exports = teamModel;