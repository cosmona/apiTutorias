'use strict';

const connectDB = require('../../db/db');

const editAnswers = async (req, res, next) => {
    let connection;    
    try {
        // pedir connection al DB
        connection = await connectDB();
  
    // Sacar name y email de req.body
    const { answers } = req.body;
	console.log('answers', answers)
	const idAnswers = req.params.id;
	console.log('idAnswers', idAnswers)
	const idUser = req.userToken.id;
	// FIXME error answer no encontrada
    // Modioficar la información actual del usuario en la base de datos
    let consult =`UPDATE answers SET Answer = "${answers} WHERE ID = ${idAnswers} AND Question_ID= ${idUser};"`;
	console.log('consult', consult)
    
    const [currentUser] = await connection.query(consult);
    //console.log('currentUser', currentUser);
  
      res.send({
        
        status: 'ok',
        message: 'Answer modificada',
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = editAnswers;