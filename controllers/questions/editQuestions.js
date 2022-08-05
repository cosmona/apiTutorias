'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

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
          consult += `, question="${question}"`;
      }
      if(technology){
          consult += `, technology="${technology}"`;
      }
      consult += ` WHERE ID = ${idQuestion} AND User_ID= ${req.userToken.id};`;
      
      //~ Ejecuta consulta SQL
      const [currentUser] = await connection.query(consult);
      
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