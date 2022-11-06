"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion de errores
const { generateErrors } = require("../../helpers");

//& Muestra una pregunta
const getQuestions = async (req, res, next) => {
  let connection;
  console.log("ENTRO AQUi");

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recoger parametros
    const { id } = req.params;
    console.log(id);

    //~ Consulta SQL de una pregunta por id
    const [question] = await connection.query(
      `
    SELECT * FROM questions
    WHERE id = ?;
    `,
      [id]
    );

    //~ Consulta SQL de sus respuestas
    const [answers] = await connection.query(
      `
    SELECT * 
    FROM answers
    WHERE question_id = ?;`,
      [id]
    );

    //! Error
    if (!question[0]) {
      await generateErrors("No se ha encontrado esta pregunta", 401);
    }

    console.log(question);

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Preguntas mostradas",
      data: {
        question: question[0],
        answer: answers,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = getQuestions;
