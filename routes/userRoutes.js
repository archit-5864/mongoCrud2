const express = require("express")
const { createUser, update, getUser, deleteUser, login, logOut, forgetPassword, resendOtp, forgetUpdatePassword } = require("../controllers/userCotroller")
const { authMiddleware } = require("../middleware/middleware")
const route = express.Router()

route.post("/login", login)
route.post("/create", createUser)
route.post("/getUser", authMiddleware, getUser)
route.put("/update", authMiddleware, update)
route.post("/deleteUser", authMiddleware, deleteUser)
route.post("/logOut", authMiddleware, logOut)

route.post("/forgetPassword", forgetPassword)
route.post("/resendOtp", resendOtp)
route.post("/forgetUpdatePassword", forgetUpdatePassword)

module.exports = route