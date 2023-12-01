const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
dotenv.config()

module.exports = {
    authMiddleware: async (req, res) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                token = req.headers.authorization.split(" ")[1]

                const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY)
                console.log("decode", decode)

                console.log(token)

            } catch (error) {
                console.log(error)
            }
        }

    }
}