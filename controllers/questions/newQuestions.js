'use strict';
//^ npm import
const {format} = require("date-fns");

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

//& Crea preguntas
const newQuestions = async (req, res, next) => {
    let connection;

	
    try {
	    //* formatea la fecha para la bd
		const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

	    //* Conexion al DB
		connection = await connectDB();
		
		//* recogemos question, title y technology y el id desde el token
		const {question, title, technology} = req.body;
		const {id} = req.userToken;

	    //~ Consulta SQL
		await connection.query(`
			INSERT INTO questions (questiondate, title, question, user_id, technology) 
			VALUES (?,?,?,?,?) 
		`,[creationDate, title, question,id,technology]);

    //* Devolvemos resultado
      res.send({
        status: 'ok',
        message: 'Question creada',
      });
    } catch (error) {
      next(error);
    } finally {
    //* Acaba la conexion
      if (connection) connection.release();
    }
  };
  
  module.exports = newQuestions;