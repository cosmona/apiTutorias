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
    const validaPassword = {
      password: req.body.password,
    };

    const { oldPassword, newPassword, repeatNewPassword, password } = req.body;

    //* Sacar id de req.body
    const { username, email, userRole, technology } = req.body;

    //* Validate password
    await validate(passwordSchema, validaPassword);

    if (oldPassword) {
      let query = "SELECT COUNT(*) FROM users ";
      query += ` WHERE ID = ${req.userToken.id}`;
      query += ` AND SHA2(?, 512) = password`;
      const [passwordOK] = await connection.query(query, [oldPassword]);

      if (passwordOK === 0) {
        await generateErrors("Wrong password", 409);
      }

      if (
        newPassword &&
        repeatNewPassword &&
        newPassword !== repeatNewPassword
      ) {
        await generateErrors(
          "Passwords do not match or need to be filled",
          409
        );
      }
    }

    //! Control de errores - Si es experto y no especifica la tecnologia
    if (userRole === "Expert" && !technology) {
      await generateErrors("Please indicate technology", 409);
    }

    //! Control de errores - mira que la tecnologia sea permitida
    if (userRole === "Expert" && !TECHNOLOGIES.includes(technology)) {
      await generateErrors("Invalid Technology", 409);
    }

    //* validacion de los datos del body
    // await validate(registrationSchema, valida);

    //! Control de errores - comprobacion del rol
    if (userRole !== "Student" && userRole !== "Expert") {
      await generateErrors("Invalid role", 409);
    }

    //~ Consulta SQL - Modificar la información actual del usuario en la base de datos
    let consult = `UPDATE users SET `;
    if (email) {
      await validate(usernameSchema, validaEmail);
      consult += `Email="${email}"`;
    }
    if (newPassword) {
      console.log("entro a if password");
      //await validate(passwordSchema, validaPass);
      consult += `,password = SHA2(${newPassword}, 512)`;
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
          "Please indicate a valid technology HTML-CSS-JavaScript-SQL-Node-React",
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
      await generateErrors("Error when trying to edit user", 409);
    }

    //* Devuelve resultado
    res.send({
      status: "ok",
      message: "User modified",
    });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    //* Finaliza la conexion
    if (connection) connection.release();
  }
};

module.exports = userEdit;
