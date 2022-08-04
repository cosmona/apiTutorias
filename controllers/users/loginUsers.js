"use strict";

const jwt = require("jsonwebtoken");
const connectDB = require("../../db/db");
const { validate } = require("../../helpers");
const { registrationSchema } = require("../../schemas");

const loginUsers = async (req, res, next) => {
  let connection;

  console.log("login");
  try {
    // pedir connection al DB
    connection = await connectDB();
    console.log("connection", connection);

    // valido los datos del body
    await validate(registrationSchema, req.body);

    // Recojo de req.body el email y la password
    const { email, password } = req.body;

    // selecionamos el usuario con este email y password
    const [user] = await connection.query(
      `
        SELECT ID, UserRole, Activation
        FROM users
        WHERE Email=? AND Password=SHA2(?, 512)
    `,
      [email, password]
    );

    // si no encuentro el usuario salgo con error
    if (user.length === 0) {
      const error = new Error("Email o password incorrecto");
      error.httpStatus = 401;
      throw error;
    }

    // comprobar que el usuario sea activo
    if (!user[0].Activation) {
      const error = new Error("El usuario no está activado");
      error.httpStatus = 401;
      throw error;
    }

    // creo objeto con los datos que quiero guardar en el token
    const info = {
      id: user[0].ID,
      role: user[0].UserRole,
      technology: user[0].technology,
    };

    // generar token
    const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.send({
      status: "ok",
      message: "Usuario logeado",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = loginUsers;
