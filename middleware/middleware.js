const dotenv = require("dotenv")
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

dotenv.config()

module.exports = {
    authMiddleware: async (req, res, next) => {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                token = req.headers.authorization.split(" ")[1]
                const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY)
                // console.log(decode, "cndbchdbdhb")
                const checkUser = await userModel.findOne({_id:decode._id, logintime:decode.iat})
                if(checkUser){
                    req.user=checkUser
                    next()
                }else{
                    return res.json({message:"Please login first..."})
                }
                // console.log(checkUser,"hxydbcb")
            } catch (error) {
                console.log("Invalid signature!")
                return res.json({
                    message: "Invalid token"
                })
            }
        }
    }
}