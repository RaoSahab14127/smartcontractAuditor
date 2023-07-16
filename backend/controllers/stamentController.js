const db = require("../services/db");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
// const getIncomeStatement = async (req, res) => {
//   try {
//     // Get the revenue transactions
//     const revenueQuery =
//       "SELECT * FROM general_journal WHERE account_type_id = ?";
//     const revenueTransactions = await db.query(revenueQuery, [3]);

//     // Get the expense transactions
//     const expenseQuery =
//       "SELECT * FROM general_journal WHERE account_type_id = ?";
//     const expenseTransactions = await db.query(expenseQuery, [4]);

//     // Calculate total revenue
//     let totalRevenue = 0;
//     for (const transaction of revenueTransactions) {
//       totalRevenue += transaction.amount;
//     }

//     // Calculate total expenses
//     let totalExpenses = 0;
//     for (const transaction of expenseTransactions) {
//       totalExpenses += transaction.amount;
//     }

//     // Calculate net income
//     const netIncome = totalRevenue - totalExpenses;

//     const incomeStatement = {
//       totalRevenue,
//       totalExpenses,
//       netIncome,
//     };

//     res.status(200).json(incomeStatement);
//   } catch (error) {
//     console.error("Error generating income statement:", error);
//     res.status(500).json({
//       error: "An error occurred while generating the income statement.",
//     });
//   }
// };
// const getIncomeStatement = async (req, res) => {
//   try {
//     // Get the revenue transactions
//     const revenueQuery =
//       "SELECT * FROM general_journal WHERE account_type_id = ?";
//     const revenueTransactions = await db.query(revenueQuery, [3]);

//     // Get the expense transactions
//     const expenseQuery =
//       "SELECT * FROM general_journal WHERE account_type_id = ?";
//     const expenseTransactions = await db.query(expenseQuery, [4]);

//     const incomeStatement = {
//       revenueTransactions,
//       expenseTransactions,
//     };

//     res.status(200).json(incomeStatement);
//   } catch (error) {
//     console.error("Error generating income statement:", error);
//     res.status(500).json({
//       error: "An error occurred while generating the income statement.",
//     });
//   }
// };
// const getIncomeStatement = async (req, res) => {
//   try {
//     // Get the date from the request body or query parameters
//     const { date } = req.params; // or req.query depending on how you want to pass the date
//     console.log(req.params);
//     // Get the revenue transactions for the specified date
//     const revenueQuery =
//       "SELECT * FROM general_journal WHERE account_type_id = ? AND DATE(transaction_date) = ?";
//     const revenueTransactions = await db.query(revenueQuery, [3, date]);

//     // Get the expense transactions for the specified date
//     const expenseQuery =
//       "SELECT * FROM general_journal WHERE account_type_id = ? AND DATE(transaction_date) = ?";
//     const expenseTransactions = await db.query(expenseQuery, [4, date]);

//     const incomeStatement = {
//       revenueTransactions,
//       expenseTransactions,
//     };

//     res.status(200).json(incomeStatement);
//   } catch (error) {
//     console.error("Error generating income statement:", error);
//     res.status(500).json({
//       error: "An error occurred while generating the income statement.",
//     });
//   }
// };
const getIncomeStatement = async (req, res) => {
  try {
    // Get the date from the request parameters
    const { date } = req.query;
    console.log(req.query);

    // Check if a date is provided
    const currentDate = date ? new Date(date) : new Date();

    // Get the revenue transactions for the specified date
    const revenueQuery =
      "SELECT * FROM general_journal WHERE account_type_id = ? AND DATE(date) <= ?";
    const revenueTransactions = await db.query(revenueQuery, [3, currentDate]);

    // Get the expense transactions for the specified date
    const expenseQuery =
      "SELECT * FROM general_journal WHERE account_type_id = ? AND DATE(date) <= ?";
    const expenseTransactions = await db.query(expenseQuery, [4, currentDate]);

    const incomeStatement = {
      revenueTransactions,
      expenseTransactions,
    };

    res.status(200).json(incomeStatement);
  } catch (error) {
    console.error("Error generating income statement:", error);
    res.status(500).json({
      error: "An error occurred while generating the income statement.",
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const query = "SELECT * FROM invoices";
    const invoices = await db.query(query);

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error retrieving invoices:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the invoices.",
    });
  }
};
const getSales = async (req, res) => {
  try {
    const query = "SELECT * FROM sales";
    const sales = await db.query(query);

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error retrieving sales:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the sales.",
    });
  }
};

module.exports = {
  getIncomeStatement,
  getSales,
  getInvoices,
};
