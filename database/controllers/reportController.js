const asyncHandler = require("express-async-handler");
const report = require("../models/reportModel");

const addReport = asyncHandler(async (req, res) => {
    const { Report_ID, Reporter_ID, ContractName, Report,time } = req.body;
  
    // Validation
    if (!Report_ID || !Reporter_ID || !ContractName ||!Report ||!time) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    // add new report
    const rprt = await report.create({
        Report_ID, Reporter_ID, ContractName, Report,time
    });
  
    if (rprt) {
      const { Report_ID, Reporter_ID, ContractName, Report,time } = rprt;
      res.status(201).json({
        Report_ID, Reporter_ID, ContractName, Report,time 
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });
  
  module.exports = {
    addReport,
  };