'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

//& Borra respuestas
const deleteAnswers = async (req, res, next) => {
  let connection;

	try {
      //* Conexion al DB
      connection = await connectDB();
  
      //* Recuperar parametros desde el endpoint (:id) e idUser (token)
      const idAnswer = req.params.id;
      const idUser = req.userToken.id;

      //~ Consulta SQL
      const estate = await connection.query(`
            DELETE FROM answers WHERE User_ID = ? AND ID = ?;`,
            [idUser, idAnswer]);

      //* si no existe la respuesta
      if(estate[0].affectedRows === 0){
        const error = new Error("No existe la respuesta");
        error.httpStatus = 409;
        throw error;
      }
      
      //* Devolvemos resultado
      res.send({
        status: 'ok',
        message: 'Answer borrada',
      });
    } catch (error) {
      next(error);
    } finally {
      //* Acaba la conexion
      if (connection) connection.release();
    }
  };
  
  module.exports = deleteAnswers;