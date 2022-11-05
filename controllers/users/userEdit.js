"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importamos funcion validate - genera errores y schema que comprueba los datos
const { validate, generateErrors } = require("../../helpers");
const {
  registrationSchema,
  usernameSchema,
  passwordSchema,
} = require("../../schemas");

//^ Importamos el fichero .env
require("dotenv").config();

//& PUT - /users/:id** - Editar un usuario | Token y Solo el propio usuario
const userEdit = async (req, res, next) => {
  console.log("entro editUser");

  let connection;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recuperamos parametros
    const { TECHNOLOGIES } = process.env;
    const validaEmail = {
      email: req.body.email,
    };
    const validaPass = {
      password: req.body.password,
    };

    //* Sacar id de req.body
    const { username, email, userRole, technology, password } = req.body;

    //! Control de errores - Si es experto y no especifica la tecnologia
    if (userRole === "Expert" && !technology) {
      await generateErrors("Por favor indique la Technology", 409);
    }

    //! Control de errores - mira que la tecnologia sea permitida
    if (userRole === "Expert" && !TECHNOLOGIES.includes(technology)) {
      await generateErrors("Tecnologia no valida", 409);
    }

    //* validacion de los datos del body
    // await validate(registrationSchema, valida);

    //! Control de errores - comprobacion del rol
    if (userRole !== "Student" && userRole !== "Expert") {
      await generateErrors("Rol no valido", 409);
    }

    //~ Consulta SQL - Modificar la información actual del usuario en la base de datos
    let consult = `UPDATE users SET `;
    if (email) {
      await validate(usernameSchema, validaEmail);
      consult += `Email="${email}"`;
    }
    if (password) {
      console.log("entro a if password");
      await validate(passwordSchema, validaPass);
      consult += `,password="${password}"`;
    }
    if (username) {
      consult += `,username="${username}"`;
    }
    if (userRole) {
      consult += `,userRole="${userRole}"`;
    }
    if (userRole === "Expert") {
      if (technology) {
        consult += `,technology="${technology}"`;
      } else {
        //! Control de errores - si es experto hay que indicar de que tecnologia
        await generateErrors(
          "Debes indicar una tecnologia valida HTML-CSS-JavaScript-SQL-Node-React",
          409
        );
      }
    } else {
      //* el rol no es experto ponemos la tecnologia a NULL
      consult += `,technology = NULL`;
    }

    consult += ` WHERE ID = ${req.userToken.id}`;

    const [currentUser] = await connection.query(consult);

    //! si no existe el usuario
    if (currentUser.affectedRows === 0) {
      await generateErrors("Error al modificar el usuario", 409);
    }

    //* Devuelve resultado
    res.send({
      status: "ok",
      message: "Usuario modificado",
    });
  } catch (error) {
    next(error);
  } finally {
    //* Finaliza la conexion
    if (connection) connection.release();
  }
};

module.exports = userEdit;
