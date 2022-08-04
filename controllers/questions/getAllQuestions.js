'use strict';

const connectDB = require('../../db/db');

const getAllQuestions = async (req, res, next) => {
    let connection;

    console.log('OOOmmmpa');
    try {
      // pedir connection al DB
      connection = await connectDB();
  
      //Recoger parametros
      const { title, technology, questionDate, answered } = req.query;

      let consult = `SELECT * FROM questions`;
      
      if (title || technology || questionDate || answered){
        consult += ` WHERE `;
        
        if(title){        
          consult += `title LIKE "%${title}%"`;
        }
        if(technology){
          if (title){
            consult += ` AND `
          }
          consult += `technology LIKE "%${technology}%"`;
        }
        if(questionDate){
          if (title || technology){
            consult += ` AND `
          }
          consult += `questionDate="${questionDate}"`;
        }
        if(answered){
          if (title || technology || questionDate){
            consult += ` AND `
          }
          consult += `answered="${answered}"`;
        }
      }

      console.log('consult', consult);
      
      const [listQuestions] = await connection.query(consult);
      //SELECT * FROM questions WHERE name=${name} AND technology=${technology} AND currentDate=${currentDate} AND answer=${answer}

      /* console.log('req.params', req.params);
      console.log('answer', answer);
      console.log('currentDate', currentDate);
      console.log('technology', technology);
      console.log('name', name);
 */
  
      res.send({
        status: 'ok',
        message: 'Questions mostradas',
        data:listQuestions,
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = getAllQuestions;