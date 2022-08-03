"use strict";

// require("dotenv").config(); //!IMPORTANTE AQUI (NO IDEA de que necesitaba esto)
const connectDB = require("../../db/db");
const { format } = require("date-fns");
const verEmail = require("@sendgrid/mail");

verEmail.setApiKey(process.env.SENDGRID_API_KEY);

const crypto = require("crypto");

//crea un nuevo user en la base de datos
const newUsers = async (req, res, next) => {
  let connection;
  const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  try {
    //debug
    console.log("new oompa user");
    console.log(req.body);
    const { username, email, password, userRole, Technology } = req.body;

    //Se llama a connectDB
    connection = await connectDB();

    //consultar DB para ver si el usuario existe
    const [users] = await connection.query(
      ` 
      SELECT * 
      FROM users
      WHERE email = ?
      ;
      `,
      [email]
    );
    console.log("users", users);

    //genera un codigo unico

    //si existe, da error
    if (users.length !== 0) {
      const error = new Error("Este email ya esta en uso");
      error.httpStatus = 409;
      throw error;
    }
    //

    //si no existe, crea el usuario en la DB inactivo y el codigo unico
    const RegistrationCode = crypto.randomBytes(25).toString("hex");

    await connection.query(
      `
          INSERT INTO users (
            CreationDate,
            Username,
            Email,
            Password,
            UserRole,
            RegistrationCode,
            Technology
          ) VALUES (?,?,?, SHA2(?, 512),?,?,?)
          `,
      [
        creationDate,
        username,
        email,
        password,
        userRole,
        RegistrationCode,
        Technology,
      ]
    );
    let cuerpo = `Bienvenido a Alejandria, por favor verifique su correo <a href="http://127.0.0.1:3000/users/validate/${RegistrationCode}">aqui!</a>`;
    let subject = "Correo de verificación Alejandria";

    //envia correo de validacion
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: subject,
      text: cuerpo,
      html: `<div>
          <h1>${subject}</h1>
          <p>${cuerpo}</p>
        </div>`,
    };

    await verEmail.send(msg);

//Fixme validacion de correo y pass

    res.status(201).send({
      Status: "ok",
      Message: "Usuario creado! por favor verifique su cuenta ",
    });
  } catch (error) {
    // console.log("error en new user", error);
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = newUsers;
