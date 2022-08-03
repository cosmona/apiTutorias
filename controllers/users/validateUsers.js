'use strict';

const getDB = require('../../db/db');

const validateUsers = async (req, res, next) => {
    let connection;

    console.log('OOOmmmpa');
    try {
      // pido conneción al DB
      connection = await getDB();
  
      const { RegistrationCode } = req.params;
      console.log('req.params', req.params)

      console.log('RegistrationCode', RegistrationCode);
  
      // comprobamos si existe un usuario con este registrationCode
      const [user] = await connection.query(
        `
        SELECT id
        FROM users
        WHERE RegistrationCode = ?
        `,
        [RegistrationCode]
        );
        console.log('user2', user)
        
      // y si no lo hay dar un error
      if (user.length === 0) {
        const error = new Error(
          'Ningun usuario encontrado con este código de validación'
        );
        error.httpStatus = 404;
        throw error;
      }
  
      // activo el usuario y borro RegistrationCode
      await connection.query(
        `
          UPDATE users
          SET Activation=true, RegistrationCode=NULL
          WHERE RegistrationCode=?
      `,
        [RegistrationCode]
      );
  
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