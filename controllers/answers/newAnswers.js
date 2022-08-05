"use strict";

//^ npm import
const { format } = require("date-fns");

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//& Crea respuestas
const newAnswers = async (req, res, next) => {
  let connection;

  try {
    //* formatea la fecha para la bd
    const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    
    //* Conexion al DB
    connection = await connectDB();
    
    //* //* Recuperar parametros desde el body y desde el token
    const { answer, question_id } = req.body;
    const user_id = req.userToken.id;

    //~ Consulta SQL
    const question = await connection.query(
      `SELECT * FROM questions
      WHERE id=?;`,
      [question_id]
    );

    //* si no existe la pregunta 
    if (question.length === 0) {
      const error = new Error("Esta pregunta no existe");
      error.httpStatus = 409;
      throw error;
    }

    //* chequea que esta persona no haya respondido ya
    const answerExist = await connection.query(
      `SELECT * FROM answers
      WHERE User_id = ? AND question_id=?;`,
      [user_id, question_id]
    );

    //* si ya ha respndido la pregunta
    if (answerExist[0].length !== 0) {
      const error = new Error("Ya has respondido esta pregunta");
      error.httpStatus = 409;
      throw error;
    }

    //~ Consulta SQL
    await connection.query(
      `INSERT INTO answers( AnswerDate, Answer, User_ID, Question_ID )
      VALUES (?,?,?,?);`,
      [creationDate, answer, user_id, question_id]
    );

    //~ Consulta SQL - cambia el valor answered en la tabla questions a true
    await connection.query(
      `UPDATE questions
        SET Answered=1
       WHERE ID=?;`,
      [question_id]
    );

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Respuesta creada",
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = newAnswers;
