"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion que genera errores
const { generateErrors } = require("../../helpers");

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

    console.log(req.body);

    //~ Consulta SQL - Actualiza la respuesta si coincide el Id y el usuario
    let consult = `UPDATE answers SET Answer = "${answer}" WHERE ID = ${idAnswers} AND User_ID = ${idUser};`;
    const estate = await connection.query(consult);

    //!Control de errores - si no existe la respuesta
    if (estate[0].affectedRows === 0) {
      await generateErrors("No existe la respuesta", 409);
    }

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Answer modificada",
    });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = editAnswers;
