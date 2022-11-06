"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion que genera errores
const { generateErrors } = require("../../helpers");

//& muestra preguntas
const getAnswers = async (req, res, next) => {
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
      WHERE id = ?
      `,
      [id]
    );

    //* Error
    if (!answer[0]) {
      await generateErrors("No se han encontrado respuestas", 401);
    }

    //* seleccionar los votos
    const [answer_votes] = await connection.query(
      `
      SELECT *
      FROM answer_votes AS av 
      JOIN answers AS a 
      WHERE a.Question_ID = ?
      `,
      [id]
    );

    let total = 0;
    for (const votes of answer_votes) {
      total += Number(votes.Vote);
    }

    const media = total / answer_votes.length;

    console.log(answer_votes);

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Respuestas mostradas",
      data: answer,
      votes: answer_votes,
      Media: media,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = getAnswers;
