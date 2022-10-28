"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion de errores
const { generateErrors } = require("../../helpers");

//& Muestra todas las preguntas
const getAllQuestions = async (req, res, next) => {
  let connection;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recoger parametros
    const { title, technology, questionDate, answered, User_ID } = req.query;

    //~ Consulta SQL
    let consult = `SELECT * FROM questions`;

    //~ monta el sql
    if (title || technology || questionDate || answered || User_ID) {
      consult += ` WHERE `;

      if (title) {
        consult += `title LIKE "%${title}%"`;
      }
      if (User_ID) {
        if (title) {
          consult += ` AND `;
        }
        consult += ` User_ID = "${User_ID} "`;
      }
      if (technology) {
        if (title || User_ID) {
          consult += ` AND `;
        }
        consult += `technology LIKE "%${technology}%"`;
      }
      if (questionDate) {
        if (title || User_ID || technology) {
          consult += ` AND `;
        }
        consult += `questionDate="${questionDate}"`;
      }
      if (answered) {
        if (title || User_ID || technology || questionDate) {
          consult += ` AND `;
        }
        consult += `answered="${answered}"`;
      }
    }

    //~ ejecuta SQL
    const [listQuestions] = await connection.query(consult);

    //* error
    if (listQuestions.length === 0) {
      await generateErrors("No hay preguntas por mostrar", 409);
    }

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Preguntas mostradas",
      data: listQuestions,
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = getAllQuestions;
