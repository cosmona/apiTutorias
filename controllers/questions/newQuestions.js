'use strict';
//^ npm import
const {format} = require("date-fns");

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

//^ Importamos el fichero .env
require("dotenv").config();

//^Importamos la funcion que genera errores
const {generateErrors} = require("../../helpers")


//& Crea preguntas
const newQuestions = async (req, res, next) => {
    let connection;

    try {
	    //* formatea la fecha para la bd
		const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

	    //* Conexion al DB
		connection = await connectDB();
		
		//* recogemos question, title y technology y el id desde el token Y LAS TECNOLOGIAS PERMITIDAS DEL ENV
		const {question, title, technology} = req.body;
		const {id} = req.userToken;
    const {TECHNOLOGIES} = process.env

    //! Control de errores mira que la tecnologia sea permitida
    if(!TECHNOLOGIES.includes(technology)){
      await generateErrors("Tecnologia no valida",409);
    }
    
	    //~ Consulta SQL
		const result = await connection.query(`
    INSERT INTO questions (questiondate, title, question, user_id, technology) 
    VALUES (?,?,?,?,?) 
		`,[creationDate, title, question,id,technology]);

    
    //* Devolvemos resultado
      res.send({
        status: 'ok',
        message: 'Question creada',
        questionID: result[0].insertId
      });
    } catch (error) {
      next(error);
    } finally {
    //* Acaba la conexion
      if (connection) connection.release();
    }
  };
  
  module.exports = newQuestions;