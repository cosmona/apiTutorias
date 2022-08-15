'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

//^ Importa funcion de errores
const { generateErrors } = require('../../helpers');


//& Borra respuestas
const deleteAnswers = async (req, res, next) => {
  let connection;

	try {
      //* Conexion al DB
      connection = await connectDB();
  
      //* Recuperar parametros desde el endpoint (:id) e idUser (token)
      const idAnswer = req.params.id;
      const idUser = req.userToken.id;

      //~ Consulta SQL- Guarda el ID de la pregunta
      let Question_ID = await connection.query(`
        SELECT Question_ID FROM answers WHERE ID =?;`,
      [idAnswer]);

      Question_ID = Question_ID[0][0].Question_ID;

      //~ Consulta SQL - Borra la respuesta si coincide el ID y el usuario
      const estate = await connection.query(`
        DELETE FROM answers WHERE User_ID = ? AND ID = ?;`,
      [idUser, idAnswer]);
      
      //! Control de errores - si no existe la respuesta
      if(estate[0].affectedRows === 0){
        await generateErrors("No existe la respuesta", 409 );
      }

      //~ Consulta SQL - Busca si hay mas respuestas a la pregunta asociada de la respuesta borrada
      const [moreAnswers] = await connection.query(
        'SELECT * FROM answers WHERE Question_ID = ?; '
        ,[Question_ID]
      ) 

      //*si no hay mas cambiar campo de la question
      if( moreAnswers.length <= 0){
        //~ Consulta SQL - cambia el valor answered en la tabla questions a false
        await connection.query(
          `UPDATE questions SET Answered = 0 WHERE ID = ?;`,
            [Question_ID]
        ); 
      }

      //* Devolvemos resultado
      res.send({
        status: 'ok',
        message: 'Respuesta borrada',
      });

    } catch (error) {
      next(error);
    } finally {
      //* Acaba la conexion
      if (connection) connection.release();
    }
  };
  
  module.exports = deleteAnswers;