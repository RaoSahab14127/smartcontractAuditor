const mongoose= require('mongoose');
const report = mongoose.Schema({
    Report_ID :{
        type: String,
        required: [true, "Please enter Report ID"],
        unique: true,
    },
    Reporter_ID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    ContractName: {
        type: String,
    },
    Report:
        [{ type: Object }]
    ,
    time:{ type: Date, default: Date.now }


})
const Report = mongoose.model("Report", report);
module.exports= Report;



