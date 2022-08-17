'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');


//^ Importamos funcion validate - genera errores y schema que comprueba los datos
const { generateErrors } = require("../../helpers");


//& Borra un usuario
const userDelete = async (req, res, next) => {
    let connection;
    
    try {
        //* Conexion al DB
        connection = await connectDB();
      
        //~ Consulta SQL - Modificar la información actual del usuario en la base de datos
        let consult ="UPDATE users SET `Activation` = '0', `Deleted` = '1' ";
        consult += ` WHERE ID = ${req.userToken.id}`;
        const [currentUser] = await connection.query(consult);
        
        //! si no existe el usuario
        if(currentUser.affectedRows === 0){
           await generateErrors("Error al borrar el usuario", 409);
        }

        //* Devuelve resultado
        res.send({
            status: 'ok',
            message: 'Usuario borrado',
        });
  } catch (error) {
      next(error);
  } finally {
    //* Finaliza la conexion
    if (connection) connection.release();
    }
  };
  
  module.exports = userDelete;