'use strict';

const getDB = require('../../db/db');

const validateUsers = async (req, res, next) => {
    let connection;

    console.log('OOOmmmpa');
    try {
      // pedir connection al DB
      connection = await getDB();
  
      //Insert code
  
      res.send({
        status: 'ok',
        message: 'Usuario validado',
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = validateUsers;