const express = require('express');
const app = express();
const conn = require("./connection/conn.js")
const routes = require("./routes/userRoutes.js")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT
app.use(fileUpload())
conn()

app.use("/user", routes)

app.listen(port, () =>{
    console.log(`App is running on... ${port}`)
})