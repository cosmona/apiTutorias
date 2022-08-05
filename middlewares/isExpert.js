"use strict";

const jwt = require("jsonwebtoken");

const { generateError } = require("../helpers");
const connectDB = require("../db/db");

const isExpert = async (req, res, next) => {
  let connection;

  console.log("Ompa isExpert");

  try {
    // pido conneción al DB
    connection = await connectDB();
    //obtiene id del usuario logeado actualmente
    const { id, role } = req.userToken;

    //verifica
    if (role !== "Expert") {
      const error = new Error("No tienes permisos por no ser Experto");
      error.httpStatus = 403;
      throw error;
    }

    next();
  } catch (error) {
    //throw error;
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isExpert;
