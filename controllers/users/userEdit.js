'use strict';

const connectDB = require('../../db/db');

const userEdit = async (req, res, next) => {
    let connection;
    console.log('userEdit', userEdit)
    
    try {
        // pedir connection al DB
        connection = await connectDB();
  
      // Sacar id de req.params
    //const { id } = req.params; // este es el id de usuario que queremos editar

    // Sacar name y email de req.body
    const { username, email, userRole, technology } = req.body;

    // Comprobar que el usuario que queremos editar es el mismo del token
    /* if (req.userToken.id !== Number(id)) {
      const error = new Error('No tienes permisos para editar este usuario');
      error.httpStatus = 403;
      throw error;
    } */

    // Modioficar la información actual del usuario en la base de datos
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
    //console.log('currentUser', currentUser);
  
      res.send({
        
        status: 'ok',
        message: 'Usuario modificado',
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = userEdit;