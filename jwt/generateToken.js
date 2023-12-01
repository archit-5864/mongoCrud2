const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    generateToken: async (id) => {
        const secretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ _id: id }, secretKey, {
            // expiresIn = "id"
        });
        return jwt.verify(token, secretKey, async (err, decode) => {
            console.log(decode,"decodedecode")
            if (err) throw err;
            try {
                const time = Math.floor(Date.now() / 1000);
                console.log(time,"time")
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