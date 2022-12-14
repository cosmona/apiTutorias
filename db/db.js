"use strict";
//^ npm import
const mySql = require("mysql2/promise");

//* Valores del fichero . env
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let connectPool;

//& Conecta pool con la DB
async function connectDB() {
  if (!connectPool) {
    connectPool = mySql.createPool({
      connectionLimit: 10,
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      timezone: "Z",
    });
  }
  return await connectPool.getConnection();
}

module.exports = connectDB;
