"use strict";
//^ npm import
const { format } = require("date-fns");

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion de errores
const { generateErrors } = require('../../helpers');

//& POST - /answers - crea una respuesta
const newAnswers = async (req, res, next) => {
  let connection;
  try {
    //* formatea la fecha para la bd
    const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    
    //* Conexion al DB
    connection = await connectDB();
    
    //* Recuperar parametros desde el body y desde el token
    const { answer, question_id } = req.body;
    const user_id = req.userToken.id;
    let answerID;

    //~ Consulta SQL - Busca si existe la pregunta
    const question = await connection.query(
      `SELECT * FROM questions WHERE id=?;`,
      [question_id]
    );

    //! Control de errores - Si no existe la pregunta 
    if (question.length === 0) {
      await generateErrors("Esta pregunta no existe", 409);
    }

    //~ Consulta SQL - Comprueba que esta persona no haya respondido ya
    const answerExist = await connection.query(
      `SELECT * FROM answers WHERE User_id = ? AND question_id=?;`
      ,[user_id, question_id]
    );

    //! Control de errores - si ya ha respondido a la pregunta
    if (answerExist[0].length !== 0) {
      await generateErrors("Ya has respondido esta pregunta", 409);
    }

    //~ Consulta SQL - Inserta la respuesta en la BD
    try {      
      let respuesta = await connection.query(
        `INSERT INTO answers( AnswerDate, Answer, User_ID, Question_ID )
        VALUES (?,?,?,?);`,
        [creationDate, answer, user_id, question_id]
        );
        answerID = respuesta[0].insertId;
    } catch (error) {
        //! Control de errores - Si da error en la foreing key de Question_ID
        await generateErrors("No existe pregunta asociada", 409);
    }

    //~ Consulta SQL - Cambia el valor answered en la tabla questions a true
    await connection.query(
      `UPDATE questions SET Answered=1 WHERE ID=?;`,
      [question_id]
    );

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Respuesta creada",
      data: {
        answerID
      }
    });
    
  } catch (error) {
    next(error);
  } finally {
    //* Finaliza la conexion
    if (connection) connection.release();
  }
};

module.exports = newAnswers;
