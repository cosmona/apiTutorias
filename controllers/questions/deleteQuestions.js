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


      const estate = await connection.query(`
      DELETE FROM questions WHERE User_ID = ? AND ID = ?;
      `,[idUser,idQuestion])
      if(estate[0].affectedRows === 0){
        const error = new Error("No existe la pregunta");
        error.httpStatus = 409;
        throw error;
      }
      
      res.send({
        status: 'ok',
        message: 'Question borrada',
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = deleteQuestions;