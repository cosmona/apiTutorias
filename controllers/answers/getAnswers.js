"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//& muestra preguntas
const getAnswers = async (req, res, next) => {
  let connection;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recuperar parametros 
    const { title, technology, questionDate, answered } = req.query;
    const [listQuestions] = await connection.query(consult);

    //! Codigo aqui

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Questions mostradas",
      data: listQuestions,
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = getAnswers;
