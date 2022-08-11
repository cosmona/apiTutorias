"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//& Muestra una pregunta
const viewUsers = async (req, res, next) => {
  let connection;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recoger parametros
    const { id } = req.params;
    const myId = req.userToken.id;

    let question;
  
    //* si es el propio usuario enseña mas o menos datos
    if (id == myId){
      //~ Consulta SQL de una pregunta por id
      question = await connection.query(`
      SELECT * FROM users
      WHERE id = ?;
      `,[id]);
    } else {
        //~ Consulta SQL de una pregunta por id
        question = await connection.query(`
        SELECT Username, UserRole, Technology FROM users
        WHERE id = ?;
        `,[id]);
    }

    


    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Usuario mostrado",
      data: {
        question: question[0]
      },
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = viewUsers;
