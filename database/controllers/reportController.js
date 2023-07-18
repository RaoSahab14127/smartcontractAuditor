const asyncHandler = require("express-async-handler");
const report = require("../models/reportModel");

const addReport = asyncHandler(async (req, res) => {
    const { Report_ID, Reporter_ID, ContractName, Report,time } = req.body;
    const a = ["hammad", "umair", "zunair"]
    // add new report
    const rprt = await report.create({
        Report_ID, Reporter_ID, ContractName, Report : a ,time
    });
    console.log("ok")
    if (rprt) {
      const { Report_ID, Reporter_ID, ContractName,time } = rprt;
      res.status(201).json({
        Report_ID, Reporter_ID, ContractName, a,time 
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });
  
  module.exports = {
    addReport,
  };