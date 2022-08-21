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
      let [QuestionData] = await connection.query(`
      SELECT Question_ID, User_ID FROM answers WHERE ID =?;`,
      [idAnswer]);

      //! Control de errores - si no existe la respuesta
      if(QuestionData.length === 0){
        await generateErrors("No existe la respuesta", 409 );
      }

      const Question_ID = QuestionData[0].Question_ID;
      const QuestionUser_ID = QuestionData[0].User_ID;

      //! Control de errores - si no eres la persona que creo la respuesta
      if(QuestionUser_ID !== idUser){
        await generateErrors("No tienes permiso de borrar esta respuesta", 409 );
      }

      //~ Consulta SQL - Borra la respuesta si coincide el ID y el usuario
      const estate = await connection.query(`
      DELETE FROM answers WHERE User_ID = ? AND ID = ?;`,
      [idUser, idAnswer]);
      

      //~ Consulta SQL - Busca si hay mas respuestas a la pregunta asociada de la respuesta borrada
      const [moreAnswers] = await connection.query(
        'SELECT * FROM answers WHERE Question_ID = ?; '
        ,[Question_ID]
      ) 

      //*si no hay más cambia el campo de la question
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