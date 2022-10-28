"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion que genera errores
const { generateErrors } = require("../../helpers");

//& muestra preguntas
const getMyAnswers = async (req, res, next) => {
  let connection;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recuperar parametros
    const { id } = req.params;

    //~ Consulta SQL de la respuesta por id
    const [answer] = await connection.query(
      `
      SELECT *
      FROM  answers
      WHERE User_ID = ?
      `,
      [id]
    );

    //* Error
    if (!answer[0]) {
      await generateErrors("No se han encontrado respuestas", 401);
    }

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Respuestas mostradas",
      data: answer,
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = getMyAnswers;
