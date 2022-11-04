"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion que genera errores
const { generateErrors } = require("../../helpers");

//& muestra preguntas
const getVotes = async (req, res, next) => {
  console.log("entra a getVotes");
  let connection;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recuperar parametros
    const { id } = req.params;

    //~ Consulta SQL de la respuesta por id
    const [answer_votes] = await connection.query(
      `
      SELECT *
      FROM  answer_votes
      JOIN answer
      WHERE Answer_ID = ?
      `,
      [id]
    );

    //* Error
    // if (!answer_votes[0]) {
    //   await generateErrors(
    //     "No se han encontrado votos para esa respuesta",
    //     401
    //   );
    // }

    let total = 0;
    for (const votes of answer_votes) {
      total += Number(votes.Vote);
    }

    const media = Math.round(total / answer_votes.length);

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "votos mostrados",
      data: answer_votes,
      Media: media,
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = getVotes;
