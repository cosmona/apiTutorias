"use strict";

//^ npm
const jwt = require("jsonwebtoken");

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importamos funcion validate - genera errores y schema que comprueba los datos
const { validate, generateErrors } = require("../../helpers");
const { registrationSchema } = require("../../schemas");

//& POST - /users/login** - Login de un usuario y devolverá el TOKEN
const loginUsers = async (req, res, next) => {
  let connection;

  try {
    //* pedir connection al DB
    connection = await connectDB();

    //* valido los datos del body
    await validate(registrationSchema, req.body);

    //* Recojemos parametros de req.body el email y la password
    const { email, password } = req.body;
    
    //~ Consulta SQL - selecionamos el usuario con este email y password
    const [user] = await connection.query(
      `
      SELECT ID, UserRole, Activation
      FROM users
      WHERE Email=? AND Password=SHA2(?, 512)
      `,
      [email, password]
      );
      
    //! Control de errores - si no encuentro el usuario salgo con error
    if (user.length === 0) {
     await generateErrors("Email o password incorrecto", 401)
    }
    
    //! Control de errores - comprobar que el usuario este activo
    if (!user[0].Activation) {
     await generateErrors("El usuario no está activado", 401)
    }

    //* crear objeto con los datos que quiere guardar en el token
    const info = {
      id: user[0].ID,
      role: user[0].UserRole,
      technology: user[0].technology,
    };

    //* generar token
    const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: "1d" });

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Usuario logeado",
      data: {
        token,
        email,
        info
      },
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = loginUsers;
