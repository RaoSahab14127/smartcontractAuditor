// Import required packages
const mysql = require("mysql2");

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: "root",
  password: "password",
  database: "test",
});
// Function to execute a SQL query
const executeQuery = (query, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
// Function to begin a transaction
const beginTransaction = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        connection.beginTransaction((error) => {
          if (error) {
            connection.release();
            reject(error);
          } else {
            resolve(connection);
          }
        });
      }
    });
  });
};

// Function to rollback a transaction
const rollbackTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      connection.release();
      resolve();
    });
  });
};

// Function to commit a transaction
const commitTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit((error) => {
      if (error) {
        connection.rollback(() => {
          connection.release();
          reject(error);
        });
      } else {
        connection.release();
        resolve();
      }
    });
  });
};
// Controller function to create general_journal entry
const createGeneralJournalEntry = async (req, res) => {
  try {
    const {
      accountTypeId1,
      transactionTypeId1,
      date1,
      amount1,
      description1,
      accountTypeId2,
      transactionTypeId2,
      date2,
      amount2,
      description2,
    } = req.body;

    // Insert new entry into general_journal table
    const query =
      "INSERT INTO general_journal (account_type_id, transaction_type_id, date, amount, description) VALUES (?, ?, ?, ?, ?)";
    const values1 = [
      accountTypeId1,
      transactionTypeId1,
      date1,
      amount1,
      description1,
    ];
    const values2 = [
      accountTypeId2,
      transactionTypeId2,
      date2,
      amount2,
      description2,
    ];

    await executeQuery(query, values1);
    await executeQuery(query, values2);

    res
      .status(200)
      .json({ message: "General journal entry created successfully." });
  } catch (error) {
    console.error("Error creating general journal entry:", error);
    res.status(500).json({
      error: "An error occurred while creating the general journal entry.",
    });
  }
};
const getTAccounts = async (req, res) => {
  try {
    const { accountTypeId } = req.params;

    // account_type_id
    // Get the debit transactions for the specified account type
    const debitQuery =
      "SELECT * FROM general_journal WHERE account_type_id = ? AND transaction_type_id = 1";
    const debitTransactions = await executeQuery(debitQuery, [accountTypeId]);

    // Get the credit transactions for the specified account type
    const creditQuery =
      "SELECT * FROM general_journal WHERE account_type_id = ? AND transaction_type_id = 2";
    const creditTransactions = await executeQuery(creditQuery, [accountTypeId]);

    const tAccounts = {
      accountTypeId,
      debitTransactions,
      creditTransactions,
    };

    res.status(200).json(tAccounts);
  } catch (error) {
    console.error("Error retrieving T-accounts:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the T-accounts.",
    });
  }
};
const getAllTransactions = async (req, res) => {
  try {
    // Retrieve all transactions from the database
    const query = "SELECT * FROM general_journal";
    const transactions = await executeQuery(query);

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the transactions.",
    });
  }
};
const getBalanceSheet = async (req, res) => {
  try {
    // Get the date from the request query parameters
    const { startDate, endDate } = req.query;

    // Fetch detailed data from MySQL tables for assets, liabilities, and owner's equity based on the provided date
    const assetsQuery = `
      SELECT * FROM general_journal
      WHERE account_type_id = 1 
      AND date BETWEEN ? AND ?
    `;
    const liabilitiesQuery = `
      SELECT * FROM general_journal
      WHERE account_type_id = 2 AND transaction_type_id = 2
      AND date BETWEEN ? AND ?
    `;
    const equityQuery = `
      SELECT * FROM general_journal
      WHERE account_type_id = 5 AND transaction_type_id = 2
      AND date BETWEEN ? AND ?
    `;

    const assetsResult = await executeQuery(assetsQuery, [startDate, endDate]);
    const liabilitiesResult = await executeQuery(liabilitiesQuery, [startDate, endDate]);
    const equityResult = await executeQuery(equityQuery, [startDate, endDate]);

    // Construct the balance sheet object
    const balanceSheet = {
      assets: assetsResult,
      liabilities: liabilitiesResult,
      equity: equityResult,
    };

    // Return the balance sheet as a JSON response
    res.status(200).json(balanceSheet);
  } catch (error) {
    console.error("Error retrieving balance sheet:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the balance sheet.",
    });
  }
};

// const getBalanceSheet = async (req, res) => {
//   try {
//     // Fetch detailed data from MySQL tables for assets, liabilities, and owner's equity
//     // const assetsQuery =
//     //   "SELECT * FROM general_journal WHERE  account_type_id = 1 AND transaction_type_id = 1";
//     // const liabilitiesQuery =
//     //   "SELECT * FROM general_journal WHERE  account_type_id = 2 AND transaction_type_id = 2";
//     // const equityQuery =
//     //   "SELECT * FROM general_journal WHERE  account_type_id = 5 AND transaction_type_id = 2";
//     // Fetch detailed data from MySQL tables for assets, liabilities, and owner's equity
//     const assetsQuery =
//       "SELECT * FROM general_journal WHERE  account_type_id = 1 AND transaction_type_id = 1";
//     const liabilitiesQuery =
//       "SELECT * FROM general_journal WHERE  account_type_id = 2 AND transaction_type_id = 2";
//     const equityQuery =
//       "SELECT * FROM general_journal WHERE  account_type_id = 5 AND transaction_type_id = 2";

//     const assetsResult = await executeQuery(assetsQuery);
//     const liabilitiesResult = await executeQuery(liabilitiesQuery);
//     const equityResult = await executeQuery(equityQuery);

//     // Construct the balance sheet object
//     const balanceSheet = {
//       assets: assetsResult,
//       liabilities: liabilitiesResult,
//       equity: equityResult,
//     };

//     // Return the balance sheet as a JSON response
//     res.status(200).json(balanceSheet);
//   } catch (error) {
//     console.error("Error retrieving balance sheet:", error);
//     res.status(500).json({
//       error: "An error occurred while retrieving the balance sheet.",
//     });
//   }
// };

// Imtiaz is buying  a product from supplier
// const purchaseProduct = async (req, res) => {
//   try {
//     const { supplierId, productId, quantity } = req.body;

//     // Fetch the product's details from the database
//     const getProductQuery = `SELECT * FROM products WHERE id = ${productId}`;

//     const product = await executeQuery(getProductQuery);

//     if (product.length === 0) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const { price, stock } = product[0];

//     if (stock < quantity) {
//       return res.status(400).json({ message: "Insufficient stock" });
//     }

//     const totalCost = price * quantity;

//     // Start a transaction to ensure data consistency
//     // await beginTransaction();

//     // Create a new invoice in the invoices table
//     const createInvoiceQuery = `INSERT INTO invoices (supplier_id, date, total_amount) VALUES (${supplierId}, NOW(), ${totalCost})`;
//     const invoiceResult = await executeQuery(createInvoiceQuery);
//     const invoiceId = invoiceResult.insertId;

//     // Check if the product exists in the inventory table
//     const checkInventoryQuery = `SELECT * FROM inventory WHERE product_id = ?`;
//     const inventory = await executeQuery(checkInventoryQuery, [productId]);

//     if (inventory.length === 0) {
//       // If the product does not exist, create a new record in the inventory table
//       const createInventoryQuery = `INSERT INTO inventory (product_id, quantity) VALUES (?, ?)`;
//       await executeQuery(createInventoryQuery, [productId, quantity]);
//     } else {
//       // If the product exists, update the existing record in the inventory table
//       const updateInventoryQuery = `UPDATE inventory SET quantity = quantity + ? WHERE product_id = ?`;
//       await executeQuery(updateInventoryQuery, [quantity, productId]);
//     }

//     // Deduct the purchased quantity from the product's stock
//     const updateProductQuery = `UPDATE products SET stock = stock - ? WHERE id = ?`;
//     await executeQuery(updateProductQuery, [quantity, productId]);
//     // Commit the transaction
//     // await commitTransaction();

//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error purchasing product:", error);
//     // await rollbackTransaction();
//     res.sendStatus(500);
//   }
// };

// const purchaseProduct = async (req, res) => {
//   try {
//     const products = req.body;
//     // Start a transaction to ensure data consistency
//     // await beginTransaction();

//     for (const product of products) {
//       const { productId, quantity, supplier_id } = product;
//       // const quantity = product.quantity || 1; // Default quantity is 1 if not provided in the request

//       // Fetch the product's details from the database
//       const getProductQuery = `SELECT * FROM products WHERE id = ${productId}`;
//       const productData = await executeQuery(getProductQuery);

//       if (productData.length === 0) {
//         return res
//           .status(404)
//           .json({ message: `Product with ID ${id} not found` });
//       }

//       const { stock: currentStock } = productData[0];

//       if (currentStock < quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for product with ID ${productId}`,
//         });
//       }

//       const totalCost = productData[0].price * quantity;

//       // Create a new invoice in the invoices table
//       const createInvoiceQuery = `INSERT INTO invoices (supplier_id, date, total_amount) VALUES (${supplier_id}, NOW(), ${totalCost})`;
//       const invoiceResult = await executeQuery(createInvoiceQuery);
//       const invoiceId = invoiceResult.insertId;

//       // Check if the product exists in the inventory table
//       const checkInventoryQuery = `SELECT * FROM inventory WHERE product_id = ${productId}`;
//       const inventory = await executeQuery(checkInventoryQuery);

//       if (inventory.length === 0) {
//         // If the product does not exist, create a new record in the inventory table
//         const createInventoryQuery = `INSERT INTO inventory (product_id, quantity) VALUES (${productId}, ${quantity})`;
//         await executeQuery(createInventoryQuery);
//       } else {
//         // If the product exists, update the existing record in the inventory table
//         const updateInventoryQuery = `UPDATE inventory SET quantity = quantity + ${quantity} WHERE product_id = ${productId}`;
//         await executeQuery(updateInventoryQuery);
//       }

//       // Deduct the purchased quantity from the product's stock
//       const updateProductQuery = `UPDATE products SET stock = stock - ${quantity} WHERE id = ${productId}`;
//       await executeQuery(updateProductQuery);
//     }

//     // Commit the transaction
//     // await commitTransaction();

//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error purchasing products:", error);
//     // await rollbackTransaction();
//     res.sendStatus(500);
//   }
// };
const purchaseProduct = async (req, res) => {
  try {
    const { products } = req.body;
    let totalCost = 0;
    // console.log("---> PRODUCTTTTS", products);

    // Start a transaction to ensure data consistency
    // await beginTransaction();

    for (const product of products) {
      const { productId, quantity, supplier_id } = product;
      // const quantity = product.quantity || 1; // Default quantity is 1 if not provided in the request

      // Fetch the product's details from the database
      const getProductQuery = `SELECT * FROM products WHERE id = ${productId}`;
      const productData = await executeQuery(getProductQuery);

      if (productData.length === 0) {
        return res
          .status(404)
          .json({ message: `Product with ID ${id} not found` });
      }

      const { stock: currentStock, price } = productData[0];

      if (currentStock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product with ID ${productId}`,
        });
      }

      const productCost = price * quantity;
      totalCost += productCost;

      // Create a new invoice in the invoices table
      const createInvoiceQuery = `INSERT INTO invoices (supplier_id, date, total_amount) VALUES (${supplier_id}, NOW(), ${productCost})`;
      const invoiceResult = await executeQuery(createInvoiceQuery);
      const invoiceId = invoiceResult.insertId;

      // Check if the product exists in the inventory table
      const checkInventoryQuery = `SELECT * FROM inventory WHERE product_id = ${productId}`;
      const inventory = await executeQuery(checkInventoryQuery);

      if (inventory.length === 0) {
        // If the product does not exist, create a new record in the inventory table
        const createInventoryQuery = `INSERT INTO inventory (product_id, quantity, selling_price) VALUES (${productId}, ${quantity} , ${
          price * 1.6
        } )`;
        await executeQuery(createInventoryQuery);
      } else {
        // If the product exists, update the existing record in the inventory table
        const updateInventoryQuery = `UPDATE inventory SET quantity = quantity + ${quantity} WHERE product_id = ${productId}`;
        await executeQuery(updateInventoryQuery);
      }

      // Deduct the purchased quantity from the product's stock
      const updateProductQuery = `UPDATE products SET stock = stock - ${quantity} WHERE id = ${productId}`;
      await executeQuery(updateProductQuery);
    }

    // Commit the transaction
    // await commitTransaction();

    res.status(200).json({ totalCost });
  } catch (error) {
    console.error("Error purchasing products:", error);
    // await rollbackTransaction();
    res.sendStatus(500);
  }
};

// Add product to product from supplier
const addProduct = async (req, res) => {
  try {
    const { name, price, stock, supplier_id } = req.body;

    // Insert the product into the database
    const query =
      "INSERT INTO products (name, price, stock, supplier_id) VALUES (?, ?, ?, ?)";
    const result = await executeQuery(query, [name, price, stock, supplier_id]);

    // Retrieve the newly created product
    const insertedProductId = result.insertId;
    const selectQuery = "SELECT * FROM products WHERE id = ?";
    const product = await executeQuery(selectQuery, [insertedProductId]);

    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the product." });
  }
};

// Imtiaz is selling
const sellProduct = async (req, res) => {
  try {
    const { userId, items } = req.body;
    console.log(req.body);

    // Start a transaction to ensure data consistency
    await executeQuery("START TRANSACTION");

    // Create a new invoice in the invoices table
    // const createInvoiceQuery = `INSERT INTO invoices (user_id, date) VALUES (?, NOW())`;
    // const invoiceResult = await executeQuery(createInvoiceQuery, [userId]);
    // const invoiceId = invoiceResult.insertId;

    for (const item of items) {
      const { itemId, quantity } = item;

      // Fetch the product's details from the database
      const getProductQuery = `SELECT * FROM inventory WHERE product_id = ${itemId}`;
      const inventory = await executeQuery(getProductQuery);
      // console.log("---->", inventory);
      if (inventory.length === 0) {
        await executeQuery("ROLLBACK");
        return res
          .status(404)
          .json({ message: "Product not found in inventory" });
      }

      const tt = inventory[0];
      console.log(tt);
      if (tt.quantity < quantity) {
        await executeQuery("ROLLBACK");
        return res
          .status(400)
          .json({ message: "Insufficient  item in inventory stock" });
      }

      // const totalCost = 1000;
      const totalCost = tt.selling_price * quantity;

      // Create a new invoice in the invoices table
      const createInvoiceQuery = `INSERT INTO invoices (user_id, date, total_amount) VALUES (?, NOW() , ?)`;
      const invoiceResult = await executeQuery(createInvoiceQuery, [
        userId,
        totalCost,
      ]);
      const invoiceId = invoiceResult.insertId;
      //     // Create a new sales record in the sales table
      const createSalesQuery = `INSERT INTO sales (invoice_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
      //
      // Create a new sales record in the sales table
      await executeQuery(createSalesQuery, [
        invoiceId,
        itemId,
        quantity,
        totalCost,
      ]);
      // Update the inventory table by reducing the quantity of the sold product
      const updateInventoryQuery = `UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?`;
      await executeQuery(updateInventoryQuery, [quantity, itemId]);
    }

    // Commit the transaction
    await executeQuery("COMMIT");

    res.sendStatus(200);
  } catch (error) {
    console.error("Error selling product:", error);
    // Rollback the transaction in case of an error
    await executeQuery("ROLLBACK");
    res.sendStatus(500);
  }
};

// const getProductListing = async (req, res) => {
//   try {
//     // Fetch product data from the database
//     const query = "SELECT * FROM products";
//     const products = await executeQuery(query);

//     // Return the product listing as a JSON response
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error retrieving product listing:", error);
//     res.status(500).json({
//       error: "An error occurred while retrieving the product listing.",
//     });
//   }
// };
const getProductListing = async (req, res) => {
  try {
    // Fetch product data from the database with supplier details
    const query = `
      SELECT p.*, s.name AS supplier_name
      FROM products p
      INNER JOIN supplier s ON p.supplier_id = s.id
    `;
    const products = await executeQuery(query);

    // Return the product listing as a JSON response
    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving product listing:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the product listing.",
    });
  }
};

const getInventoryProducts = async (req, res) => {
  try {
    // Fetch product data from the inventory table and group it by product
    // const query = `
    //   SELECT
    //     p.id,
    //     p.name,
    //     p.price,
    //     SUM(i.quantity) AS total_quantity
    //   FROM products AS p
    //   INNER JOIN inventory AS i ON p.id = i.product_id
    //   GROUP BY p.id, p.name, p.price
    // `;
    const query = `
    SELECT
      p.id,
      p.name,
      p.price,
      i.selling_price,
      SUM(i.quantity) AS total_quantity
    FROM products AS p
    INNER JOIN inventory AS i ON p.id = i.product_id
    GROUP BY p.id, p.name, i.selling_price
  `;

    const inventoryProducts = await executeQuery(query);

    res.status(200).json(inventoryProducts);
  } catch (error) {
    console.error("Error retrieving inventory products:", error);
    res.status(500).json({
      error: "An error occurred while retrieving inventory products.",
    });
  }
};
const getSuppliers = async (req, res) => {
  try {
    // Fetch supplier data from the database
    const query = "SELECT * FROM supplier";
    const suppliers = await executeQuery(query);

    // Return the supplier data as a JSON response
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error retrieving suppliers:", error);
    res.status(500).json({
      error: "An error occurred while retrieving the suppliers.",
    });
  }
};

// Export the controller functions
module.exports = {
  createGeneralJournalEntry,
  getTAccounts,
  getBalanceSheet,
  purchaseProduct,
  addProduct,
  getProductListing,
  sellProduct,
  getInventoryProducts,
  getAllTransactions,
  getSuppliers,
};
