const express = require("express")
const { createUser, update, getUser, deleteUser, login } = require("../controllers/userCotroller")
const { authMiddleware } = require("../middleware/middleware")
const route = express.Router()

route.post("/login", login)
route.post("/create", createUser)
route.post("/getUser",authMiddleware, getUser)
route.put("/update", update)
route.post("/deleteUser", deleteUser)

module.exports = route