// Import required packages
const cors = require("cors");
const dotenv = require("dotenv");

const express = require("express");
const bodyParser = require("body-parser");
const {
  createGeneralJournalEntry,
  getBalanceSheet,
  getTAccounts,
  purchaseProduct,
  addProduct,
  sellProduct,
  getProductListing,
  getInventoryProducts,
  getAllTransactions,
  getSuppliers,
} = require("./controllers");
const userRoute = require("./routes/userRoute");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const {
  getIncomeStatement,
  getInvoices,
  getSales,
} = require("./controllers/stamentController");

// Create an Express app
const app = express();
app.use(cors());
// Middleware for parsing JSON requests
app.use(bodyParser.json());
app.use(express.json());
// Route for creating general journal entry
app.post("/api/general-journal", createGeneralJournalEntry);
app.get("/api/general-journal", getAllTransactions);

// app.get("/api/balance-sheet", getBalanceSheet);
app.get("/api/t-accounts/:accountTypeId", getTAccounts);
app.get("/api/balance-sheet", getBalanceSheet);
app.get("/api/income-statement", getIncomeStatement);
app.get("/api/invoices", getInvoices);
app.get("/api/sales", getSales);

app.post("/api/purchase-product", purchaseProduct);
app.post("/api/products", addProduct);
app.get("/api/products", getProductListing);
app.get("/api/inventory", getInventoryProducts);

// SUPPLIERS
app.get("/api/suppliers", getSuppliers);

app.get("/is-ready", (req, res) => {
  res.send("API is Ready for consuming!!");
});
app.use("/api/v1/users", userRoute);
app.use(globalErrorHandler);

app.post("/api/sell-product", sellProduct);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `This route is not available on this server ${req.originalUrl}`,
      400
    )
  );
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
