"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importamos funcion validate - genera errores y schema que comprueba los datos
const { generateErrors } = require("../../helpers");

//& Borra un usuario
const userDelete = async (req, res, next) => {
  let connection;
  const user = req.userToken.id;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //~ Consulta SQL - Modificar la información actual del usuario en la base de datos
    // let consult ="UPDATE users SET `Activation` = '0', `Deleted` = '1' ";
    //~ Consulta SQL - Borra los votos del usuario
    await connection.query(
      `
          DELETE FROM answer_votes WHERE User_ID = ?;
          `,
      [user]
    );

    //~ Consulta SQL - Borra todas las respuestas asociadas
    await connection.query(
      `
          DELETE FROM answers WHERE User_ID = ?;
        `,
      [user]
    );

    //~ Consulta SQL - Borra la pregunta
    const estate = await connection.query(
      `
         DELETE FROM questions WHERE User_ID = ?;
       `,
      [user]
    );

    let consult = "DELETE FROM users";
    consult += ` WHERE ID = ${user}`;
    const [currentUser] = await connection.query(consult);

    //! si no existe el usuario
    if (currentUser.affectedRows === 0) {
      await generateErrors("Error al borrar el usuario", 409);
    }

    //* Devuelve resultado
    res.send({
      status: "ok",
      message: "Usuario borrado",
    });
  } catch (error) {
    next(error);
  } finally {
    //* Finaliza la conexion
    if (connection) connection.release();
  }
};

module.exports = userDelete;
