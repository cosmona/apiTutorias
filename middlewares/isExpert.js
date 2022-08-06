"use strict";
//^npm import
const jwt = require("jsonwebtoken");

//^ import helper para generar errores
const { generateError } = require("../helpers");

//^ Importamos funcion que conecta a la BD
const connectDB = require("../db/db");

//& Comprueba si el rol es Experto
const isExpert = async (req, res, next) => {
  let connection;

  try {
    //* Conecta a la DB
    connection = await connectDB();

    //* obtiene id y ell rol del usuario logeado actualmente
      const { id, role } = req.userToken;

    //* verifica el rol
    if (role !== "Expert") {
        const error = new Error("No tienes permisos por no ser Experto");
        error.httpStatus = 403;
        throw error;
    }

    next();
  } catch (error) {
      next(error);
    } finally {
      //* Finaliza la conexion
      if (connection) connection.release();
    }
};

module.exports = isExpert;
