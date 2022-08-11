"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion de errores
const { generateErrors } = require('../../helpers');

//& Muestra una pregunta
const getQuestions = async (req, res, next) => {
  let connection;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recoger parametros
    const { id } = req.params;

    //~ Consulta SQL de una pregunta por id
    const [question] = await connection.query(`
    SELECT * FROM questions
    WHERE id = ?;
    `,[id]);
    
    //~ Consulta SQL de sus respuestas
    const [answers] = await connection.query(`
    SELECT * 
    FROM answers
    WHERE question_id = ?;`
    ,[id]);
    
    console.log('question', question[0]);

    //* Error
    if(!question[0]){
      await generateErrors("No se ha encontrado esta pregunta", 401);
    }

    //* Devolvemos resultado
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
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = getQuestions;
