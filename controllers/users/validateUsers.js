'use strict';

//^ Importamos funcion que conecta a la BD
const getDB = require('../../db/db');

//& Valida Usuario
const validateUsers = async (req, res, next) => {
    let connection;

    try {
      //* Conexion al DB
      connection = await getDB();
      
      //* Recogemos parametros
      const { RegistrationCode } = req.params;
      
      //~ Consulta SQL - comprobamos si existe un usuario con este registrationCode
      const [user] = await connection.query(
        `
        SELECT id
        FROM users
        WHERE RegistrationCode = ?
        `,
        [RegistrationCode]
        );

        
      //*si no existe el codigo de validacin
      if (user.length === 0) {
        const error = new Error(
          'Ningun usuario encontrado con este código de validación'
        );
        error.httpStatus = 404;
        throw error;
      }
  
      //* activamos el usuario y borramos RegistrationCode
      await connection.query(
        `
          UPDATE users
          SET Activation=true, RegistrationCode=NULL
          WHERE RegistrationCode=?
      `,
        [RegistrationCode]
      );
  
      //* Devolvemos resultados
      res.send({
        status: 'ok',
        message: 'Usuario validado',
      });
    } catch (error) {
      next(error);
    } finally {
      //* Acabamos la conexion
      if (connection) connection.release();
    }
  };
  
  module.exports = validateUsers;