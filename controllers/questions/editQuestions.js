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
      
      //~ Ejecuta consulta SQL
      const [currentUser] = await connection.query(consult);
      console.log('currentUser', currentUser)
      
      //! Error
      //TODO si el usuario que quiere modificar no es el creador de la pregunta se va por aqui
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