const mongoose = require('mongoose');

const tempPlayerSchema = new mongoose.Schema({
    Player_Name : String,
    Player_Description : String,
    Player_Position : String,
    Player_Price : Number,
    Player_Image : String,
    Owner_Name : String
})

const tempModel = mongoose.model("tempPlayer", tempPlayerSchema);

module.exports = tempModel;