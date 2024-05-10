const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    Player_Name : String,
    Player_Description : String,
    Player_Position : String,
    Player_Price : Number,
    Player_Image : String,
    Owner_Name : String
})

const playerModel = mongoose.model("players", PlayerSchema);

module.exports = playerModel;