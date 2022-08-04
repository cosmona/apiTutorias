"use strict";

const connectDB = require("../../db/db");

const getQuestions = async (req, res, next) => {
  let connection;

  console.log("BEEPBOOP una pregunta");
  try {
    // pedir connection al DB
    connection = await connectDB();

    //Recoger parametros
    const { id } = req.params;

    const question = await connection.query(
      `
    SELECT * 
    FROM questions
    WHERE id = ?;
    `,
      [id]
    );

    const [answers] = await connection.query(
      `
    SELECT * 
    FROM answers
    WHERE question_id = ?;
    `,
      [id]
    );

    res.send({
      status: "ok",
      message: "Questions mostradas",
      data: {
        question: question[0],
        answer: answers,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getQuestions;
