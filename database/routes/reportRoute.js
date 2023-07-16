const express = require("express");
const { addReport } = require("../controllers/reportController");
const router = express.Router();



router.post("/addreport", addReport);


module.exports = router;