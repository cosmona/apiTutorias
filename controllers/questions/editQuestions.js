'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

//^ Importa funcion de errores
const { generateErrors } = require('../../helpers');

//& Edita una pregunta
const editQuestions = async (req, res, next) => {
    let connection;    
    try {
      //* Conexion al DB
      connection = await connectDB();
      
      //* Recoger parametros
      const { title, question, technology } = req.body;
	    const idQuestion = req.params.id;
      const idUser = req.userToken.id;
      
      //~ Consulta SQL - Comparación de ID
      const userID = await connection.query(`
      SELECT User_ID FROM questions WHERE ID = ?;
      `,[idQuestion]);
      
      //! Control de errores - usuario id y pregunta id no coinciden
      if(idUser !== userID[0][0].User_ID){
       await generateErrors("No puedes editar esta pregunta", 409)
      }

      //~ Montamos consulta SQL
      let consult =`UPDATE questions SET `;
      if(title){        
          consult += ` title = "${title}"`;
      }
      if(question){
        if(title){
          consult += `, `
        }
          consult += ` question="${question}"`;
      }
      if(technology){
        if(title || question){
          consult += `, `
        }
          consult += ` technology="${technology}"`;
      }
      consult += ` WHERE ID = ${idQuestion} AND User_ID= ${req.userToken.id};`;
            
      const [currentUser] = await connection.query(consult);
      
      //! Error
      if(currentUser.affectedRows === 0){
        await generateErrors("No se ha encontrado esta pregunta", 409)
      }

      //* Devolvemos resultado
      res.send({
        status: 'ok',
        message: 'Question modificada',
      });
    } catch (error) {
      next(error);
    } finally {
        //* Acaba la conexion
        if (connection) connection.release();
    }
  };
  
  module.exports = editQuestions;