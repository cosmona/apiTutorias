"use strict";

//^ npm import
const { format } = require("date-fns");

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion de errores
const { generateErrors } = require("../../helpers");

//& Crea votos
const newVotes = async (req, res, next) => {
  let connection;

  try {
    //* formatea la fecha para la bd
    const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    //* Conexion al DB
    connection = await connectDB();

    //* //* Recuperar parametros desde el body y desde el token
    const { vote } = req.body;
    const user_id = req.userToken.id;
    const answer_id = req.params.id;

    //~ Verifica que no se haya votado esta respuesta ya
    const answered = await connection.query(
      `SELECT * 
      FROM  answer_votes
      WHERE user_id=? AND answer_id = ?`,
      [user_id, answer_id]
    );

    //

    //* si ya respondimos
    if (answered[0].length !== 0) {
      await generateErrors("You already voted this answer", 409);
    }

    //~ Consulta SQL
    const answer = await connection.query(
      `INSERT INTO answer_votes (Date, Vote, Answer_id, User_id)
      VALUES (?,?,?,?);`,
      [creationDate, vote, answer_id, user_id]
    );

    //* si no existe la respuesta
    if (answer.length === 0) {
      await generateErrors("Answer does not exist", 409);
    }

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Answer voted",
    });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = newVotes;
