'use strict';

const connectDB = require('../../db/db');

const editQuestions = async (req, res, next) => {
    let connection;    
    try {
        // pedir connection al DB
        connection = await connectDB();
  
    // Sacar name y email de req.body
    const { title, question, technology } = req.body;
	const idQuestion = req.params.id;
	console.log('idQuestion', idQuestion)
    // Comprobar que el usuario que queremos editar es el mismo del token
    /* if (req.userToken.id !== Number(id)) {
      const error = new Error('No tienes permisos para editar este usuario');
      error.httpStatus = 403;
      throw error;
    } */

    // Modioficar la información actual del usuario en la base de datos
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
    console.log('consult', consult)

    const [currentUser] = await connection.query(consult);
    //console.log('currentUser', currentUser);
  
      res.send({
        
        status: 'ok',
        message: 'Question modificada',
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = editQuestions;