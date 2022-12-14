"use strict";

//^ import helper para generar errores
const { generateError } = require("../helpers");

//^ Importamos funcion que conecta a la BD
const connectDB = require("../db/db");

//& Comprueba si el rol es Experto
const isExpert = async (req, res, next) => {
  let connection;
  console.log("comprobamos rol");

  try {
    //* Conecta a la DB
    connection = await connectDB();

    //* obtiene id y ell rol del usuario logeado actualmente
    const { role } = req.userToken;

    //! verifica el rol
    if (role !== "Expert") {
      await generateError("No tienes permisos", 403);
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    //* Finaliza la conexion
    if (connection) connection.release();

    console.log("termina comprobamos rol");
  }
};

module.exports = isExpert;
