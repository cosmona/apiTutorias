'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');


//^ Importamos funcion validate - genera errores y schema que comprueba los datos
const { validate, generateErrors } = require("../../helpers");
const { registrationSchema } = require("../../schemas");


//& Edita un usuario
const userEdit = async (req, res, next) => {
    let connection;
    
    try {
        //* Conexion al DB
        connection = await connectDB();
      
        const valida = {
            "email":req.body.email,
            "password":req.body.password
        }

        //! validacion de los datos del body faltan userRole y technology
         await validate(registrationSchema, valida);

        //* Sacar id de req.body
        const { username, email, userRole, technology } = req.body;

        //! comprobacion del rol
        if (userRole!=="Student" && userRole!=="Expert") {
            await generateErrors("Rol no valido",409);
        }
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
        
        //! si no existe el usuario
        if(currentUser.affectedRows === 0){
           await generateErrors("Error al modificar el usuario", 409);
        }

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