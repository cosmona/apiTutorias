"use strict";

//^ npm import
const { format } = require("date-fns");
const verEmail = require("@sendgrid/mail");
const crypto = require("crypto");

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importamos el fichero .env
require("dotenv").config();

//^ Importamos funcion validate - genera errores y schema que comprueba los datos
const { validate, generateErrors } = require("../../helpers");
const { registrationSchema } = require("../../schemas");

//* coge el secreto de la api de sengrid y lo aplica
verEmail.setApiKey(process.env.SENDGRID_API_KEY);

//& Crea usuario
const newUsers = async (req, res, next) => {
  let connection;

  //* formatea la fecha para la BD
  const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recuperamos parametros
    let { username, email, password, userRole, technology } = req.body;
    const { TECHNOLOGIES } = process.env;
    const valida = {
      email: req.body.email,
      password: req.body.password,
    };

    if (userRole === "Student") {
      technology = "0";
    }

    //! Control de errores - Si es experto y no especifica la tecnologia
    if (userRole === "Expert" && !technology) {
      await generateErrors("Por favor indique la Technology", 409);
    }

    //! Control de errores - mira que la tecnologia sea permitida
    if (!TECHNOLOGIES.includes(technology)) {
      await generateErrors("Tecnologia no valida", 409);
    }

    //* validacion de los datos del body
    await validate(registrationSchema, valida);

    //~ Consulta SQL - Consultar DB para ver si el usuario existe
    const [users] = await connection.query(
      `SELECT * FROM users
      WHERE email = ?;
      `,
      [email]
    );

    //! si existe, da error
    if (users.length !== 0) {
      await generateErrors("Este email ya esta en uso", 409);
    }

    //* si no existe, crea el usuario en la DB inactivo y el codigo unico
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
        technology,
      ]
    );
    let cuerpo = `
                    <body>
                      <header style="text-align: center;">
                        <img src="https://apitutorias.netlify.app/images/logo.png" width="400px" alt="">
                      </header>
                      <p style="text-align: center;">
                        Bienvenido a Alejandria, por favor verifique su correo <a href="http://127.0.0.1:3000/users/validate/${RegistrationCode}">aqui!</a>
                      </p>
                      
                    </body>
                   
      `;

    let subject = "Correo de verificación Alejandria";

    //* envia correo de validacion
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

    try {
      await verEmail.send(msg);
    } catch (error) {
      //! Error generico en sendgrid
      await generateErrors("Error al enviar el correo", 409);
    }

    //* Devolvemos resultado
    res.status(201).send({
      Status: "ok",
      Message: "Usuario creado! por favor verifique su cuenta ",
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) {
      connection.release();
    }
  }
};

module.exports = newUsers;
