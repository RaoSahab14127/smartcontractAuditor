const express = require("express");
const { createUser, getAllUsers } = require("../controllers/userController");

// const { restrictTo } = require("../controllers/authController");

const userRoute = express.Router();

userRoute.get("/", getAllUsers);
userRoute.post("/sign-up", createUser);

module.exports = userRoute;
