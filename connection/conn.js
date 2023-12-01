const db = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()
const dbcConnectionUrl = process.env.DB

const conn = async () => {
    try {
        await db.connect(dbcConnectionUrl)
        console.log("Database connected...")
    } catch (error) {
        console.log(error)
    }
}

module.exports = conn;