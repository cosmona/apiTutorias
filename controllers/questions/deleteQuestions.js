'use strict';

const connectDB = require('../../db/db');

const deleteQuestions = async (req, res, next) => {
    let connection;

	try {
      // pedir connection al DB
      connection = await connectDB();
  
      //*recuperar parametros

      const idQuestion = req.params.id;
      console.log('idQuestion', idQuestion)

      
      const idUser = req.userToken.id;
      console.log('idUser', idUser)

      //Borra tabla answers_votes asociada
      await connection.query(`
      DELETE FROM answer_votes WHERE Question_ID = ?;
      `,[idQuestion]);

      //Borra todas las respuestas asociadas
      await connection.query(`
      DELETE FROM answers WHERE Question_ID = ?;
      `,[idQuestion]);

      //Borra la pregunta
      const estate = await connection.query(`
      DELETE FROM questions WHERE User_ID = ? AND ID = ?;
      `,[idUser,idQuestion])
      if(estate[0].affectedRows === 0){
        const error = new Error("No existe la pregunta");
        error.httpStatus = 409;
        throw error;
      }
      
      //Control de errores - usuario id y pregunta id no coinciden
      


      
      res.send({
        status: 'ok',
        message: 'Preguntas y respuestas borradas',
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = deleteQuestions;