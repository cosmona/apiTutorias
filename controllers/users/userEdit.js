'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

//& Edita un usuario
const userEdit = async (req, res, next) => {
    let connection;
    
    try {
      //* Conexion al DB
      connection = await connectDB();
  
      //* Sacar id de req.params
      const { username, email, userRole, technology } = req.body;

      //~ Consulta SQL - Modificar la información actual del usuario en la base de datos
    let consult =`UPDATE users SET `;
    if(email){        
        consult += `Email="${email}"`;
    }
    if(username){
        consult += `,username="${username}"`;
    }
    if(userRole){
        consult += `,userRole="${userRole}"`;
    }
    if(technology){
        consult += `,technology="${technology}"`;
    }

    consult += ` WHERE ID = ${req.userToken.id}`;

    const [currentUser] = await connection.query(consult);
    
    //* Devuelve resultado
    res.send({
        status: 'ok',
        message: 'Usuario modificado',
    });
  } catch (error) {
      next(error);
  } finally {
    //* Finaliza la conexion
    if (connection) connection.release();
    }
  };
  
  module.exports = userEdit;