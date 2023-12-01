const mongoose = require("mongoose")

const user = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    token: {type: String},
    logintime: {type: String},

}, {timestamps: true})

module.exports = new mongoose.model ("user", user);