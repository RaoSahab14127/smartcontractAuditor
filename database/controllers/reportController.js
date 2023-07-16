const asyncHandler = require("express-async-handler");
const Report = require("../models/reportModel");

const addReport = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    // Validation
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    // add new report
    const user = await Report.create({

    });
  
    if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(201).json({
        _id,
        name,
        email,
        photo,
        phone,
        bio,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });
  
  module.exports = {
    addReport,
  };