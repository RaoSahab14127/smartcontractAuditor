const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const reportRoute = require("./routes/reportRoute");
const errorHandler = require("./middleWare/errorMiddleWare")
const app = express()
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use("/api/users", userRoute);
app.use("/api/result", reportRoute);
app.get("/", (req, res)=>{
    res.send("Hello Home Page")
})
app.use(errorHandler);
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT ,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err)=>{
console.log(`error is ${err}`)
})