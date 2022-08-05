'use strict';

const connectDB = require('../../db/db');
const {format} = require("date-fns");

const newQuestions = async (req, res, next) => {
    let connection;

	console.log('Ompa question', );
	const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    try {
    	// pedir connection al DB
    	connection = await connectDB();
		
		//* recogemos question, title y technology
		const {question, title, technology} = req.body;
		

		// *recogemos el id desde el token
		const {id} = req.userToken;
		console.log('id', id)

		//* Query
		await connection.query(`
			INSERT INTO questions (questiondate, title, question, user_id, technology) 
			VALUES (?,?,?,?,?) 
		`,[creationDate, title, question,id,technology]);

      res.send({
        status: 'ok',
        message: 'Question creada',
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = newQuestions;