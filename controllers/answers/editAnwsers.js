'use strict';

//^ Importamos funcion que conecta a la BD
const connectDB = require('../../db/db');

//& Edita una respuesta
const editAnswers = async (req, res, next) => {
    let connection;   

    try {
      //* Conexion al DB
      connection = await connectDB();
      
      //* Recuperar parametros name y email 
      const { answer } = req.body;
	    const idAnswers = req.params.id;
	    const idUser = req.userToken.id;
	  
    //~ consulta SQL
    let consult =`
                  UPDATE answers SET Answer = "${answer}" 
                  WHERE ID = ${idAnswers} AND User_ID = ${idUser};`;
    const estate = await connection.query(consult);

    //* si no existe la respuesta
    if(estate[0].affectedRows === 0){
      const error = new Error("No existe la respuesta");
      error.httpStatus = 409;
      throw error;
    }

    //* Devolvemos resultado
    res.send({    
        status: 'ok',
        message: 'Answer modificada',
    });

    } catch (error) {
      next(error);
    } finally {
      //* Acaba la conexion
      if (connection) connection.release();
    }
  };
  
  module.exports = editAnswers;