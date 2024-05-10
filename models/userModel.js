const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    User_Name : String,
    User_Email : String,
    User_Password : String,
    User_ConfirmPassword : String
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel