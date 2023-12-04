const mongoose = require("mongoose")

const user = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    otp: {type: Number,default:0},
    token: {type: String},
    logintime: {type: String},

}, {timestamps: true})

module.exports = new mongoose.model ("user", user);