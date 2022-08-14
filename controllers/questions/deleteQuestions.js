'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

//^ Importa funcion de errores
const { generateErrors } = require('../../helpers');

//& Borra una pregunta
const deleteQuestions = async (req, res, next) => {
    let connection;

	try {
      //* Conexion al DB
      connection = await connectDB();
  
      //*recuperar parametros
      const idQuestion = req.params.id;
      const idUser = req.userToken.id;
      
      //~ Consulta SQL - Comparación de ID
      const userID = await connection.query(`
      SELECT User_ID FROM questions WHERE ID = ?;
      `,[idQuestion]);
      
      //! Control de errores - usuario id y pregunta id no coinciden
      if(idUser !== userID[0][0].User_ID){
        await generateErrors("No puedes borrar esta pregunta", 409)
      }
      
      //~ Consulta SQL - Borra los votos
      await connection.query(`
      DELETE FROM answer_votes WHERE Answer_ID = ?;
      `,[idQuestion]);
      

      //~ Consulta SQL - Borra todas las respuestas asociadas
      await connection.query(`
        DELETE FROM answers WHERE Question_ID = ?;
      `,[idQuestion]);

      //~ Consulta SQL - Borra la pregunta
      const estate = await connection.query(`
        DELETE FROM questions WHERE User_ID = ? AND ID = ?;
      `,[idUser,idQuestion])

      //! Si no exite la pregunta
      if(estate[0].affectedRows === 0){
        await generateErrors("No existe la pregunta", 409)
      }
      
      //* Devolvemos resultados
      res.send({
        status: 'ok',
        message: 'Preguntas y respuestas borradas',
      });
    } catch (error) {
      next(error);
    } finally {
        //* Acaba la conexion
        if (connection) connection.release();
    }
  };
  
  module.exports = deleteQuestions;