"use strict";

const connectDB = require("../../db/db");
const { format } = require("date-fns");

const newAnswers = async (req, res, next) => {
  let connection;
  const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  console.log("OOOmmmpa");
  try {
    // pedir connection al DB
    connection = await connectDB();
    //  answer desde el body
    const { answer, question_id } = req.body;
    console.log("question_id", question_id);
    console.log("answer", answer);
    // id del usuario
    const user_id = req.userToken.id;

    //Insert code
    //revisar si la pregunta con ese id existe
    const question = await connection.query(
      `SELECT * 
      FROM questions
      WHERE id=?`,
      [question_id]
    );
    if (question.length === 0) {
      const error = new Error("Esta pregunta no existe");
      error.httpStatus = 409;
      throw error;
    }
    await connection.query(
      `
      INSERT INTO answers( AnswerDate, Answer, User_ID, Question_ID )
      VALUES (?,?,?,?);
      `,
      [creationDate, answer, user_id, question_id]
    );

    res.send({
      status: "ok",
      message: "Respuesta creada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newAnswers;
