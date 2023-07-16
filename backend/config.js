const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    // host: "db4free.net",
    // user: "restapitest123",

    user: "root",
    password: "password",
    database: "test",
  },
  listPerPage: 10,
};
module.exports = config;
