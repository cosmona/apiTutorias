"use strict";

//^npm import
const jwt = require("jsonwebtoken");

//^ Importamos funcion que conecta a la BD
const connectDB = require("../db/db");

//^ Importa funcion que genera errores
const { generateErrors } = require("../helpers");

//& Comprueba token
const isUser = async (req, res, next) => {
  let connection;

  console.log("llegoo is user");

  try {
    //* Conecta a la DB
    connection = await connectDB();

    //* recoje parametros
    const { authorization } = req.headers;
    console.log("req.headers", req.headers);
    console.log(authorization);

    //! si no tengo Authorization salgo con un error
    if (!authorization) {
      await generateErrors("Por favor inicie sesion", 401);
    }

    //* verifica token
    let tokenInfo;

    tokenInfo = jwt.verify(authorization, process.env.JWT_SECRET);

    //* añadimos en la request (req) el tokenInfo
    req.userToken = tokenInfo;
    console.log("termino isuser");
    next();
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    //* finaliza la conexion
    if (connection) connection.release();
  }
};

module.exports = isUser;
