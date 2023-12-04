const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userModel = require("../models/userModel");
dotenv.config();

module.exports = {
    generateToken: async (id) => {
        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ _id: id }, secretKey, {
            // expiresIn = "1d"
        });
        return jwt.verify(token, secretKey, async (err, decode) => {
            // console.log(token, "decodedecode")
            if (err) throw err;
            try {
                const time = Math.floor(Date.now() / 1000);
                // console.log(time, "time")
                await userModel.findByIdAndUpdate({ _id: decode._id }, {
                    logintime: decode.iat,
                    token: token
                }, { new: true })
                return {
                    token: token,
                    time: time
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
}