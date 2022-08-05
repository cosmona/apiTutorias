'use strict';

const connectDB = require('../../db/db');

const deleteAnswers = async (req, res, next) => {
    let connection;

	try {
      // pedir connection al DB
      connection = await connectDB();
  
      //*recuperar parametros

      const idAnswer = req.params.id;
      console.log('idAnswer', idAnswer)

      
      const idUser = req.userToken.id;
      console.log('idUser', idUser)


      const estate = await connection.query(`
      DELETE FROM answers WHERE User_ID = ? AND ID = ?;
      `,[idUser,idAnswer])
      if(estate[0].affectedRows === 0){
        const error = new Error("No existe la respuesta");
        error.httpStatus = 409;
        throw error;
      }
      
      res.send({
        status: 'ok',
        message: 'Answer borrada',
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = deleteAnswers;