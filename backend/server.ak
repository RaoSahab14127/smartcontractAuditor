require("dotenv").config();
const mysql = require("mysql");

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Function to execute SQL queries
function executeQuery(query, values = []) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(query, values, (error, results) => {
        connection.release();

        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
}

// Example accounting cycle functions

// 1. Create a new journal entry
async function createJournalEntry(
  date,
  description,
  debitAccountId,
  creditAccountId,
  amount
) {
  const query = "INSERT INTO journal_entries (date, description) VALUES (?, ?)";
  const values = [date, description];

  try {
    const result = await executeQuery(query, values);
    const entryId = result.insertId;

    // Create debit entry
    // await createJournalEntryLineItem(entryId, debitAccountId, amount, 'debit');

    // Create credit entry
    // await createJournalEntryLineItem(entryId, creditAccountId, amount, 'credit');

    console.log("Journal entry created successfully.");
  } catch (error) {
    console.error("Error creating journal entry:", error);
  }
}

// 2. Create a line item for a journal entry
async function createJournalEntryLineItem(entryId, accountId, amount, type) {
  const query =
    "INSERT INTO journal_entry_line_items (entry_id, account_id, amount, type) VALUES (?, ?, ?, ?)";
  const values = [entryId, accountId, amount, type];

  try {
    await executeQuery(query, values);
    console.log("Journal entry line item created successfully.");
  } catch (error) {
    console.error("Error creating journal entry line item:", error);
  }
}

// Example usage
createJournalEntry("2023-06-11", "Salary payment", 1, 2, 1000);
