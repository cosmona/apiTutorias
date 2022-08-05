"use strict";

//* Dependencias
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

//* Controllers
const { newUsers, validateUsers, loginUsers, userEdit } = require("./controllers/users");
const { newQuestions, getAllQuestions, getQuestions, deleteQuestions } = require("./controllers/questions");
const { newAnswers } = require("./controllers/answers/index");

//* Middlewares
const { isUser, userExists, isExpert } = require("./middlewares");


const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//* puerto desde el fichero de configuracion
const { PORT } = process.env;

//& Endpoints Users

//* POST - /users/** - Crear el usuario
app.post("/users", newUsers);

//* POST - /users/validate/:RegistrationCode** - Validar el usuario
app.get("/users/validate/:RegistrationCode", validateUsers);

//* POST - /users/login** - Login de un usuario y devolverá el TOKEN
app.post("/users/login/", loginUsers);

//* PUT - /users/:id** - Editar un usuario | Token y Solo el propio usuario
app.put("/users", isUser, userEdit);

//& Endpoints Questions

//* GET - /questions** - Todass las entradas y buscar entradas | Sin token - questions?name=nombre&category=categoria&date=fecha&answer=true
app.get("/questions", getAllQuestions);

//* POST - /questions** - crea una entrada | Token obligatorio
app.post("/questions", isUser, newQuestions);

//* GET - /questions/:id** - JSON que muestra información de una entrada | Sin token
app.get("/questions/:id", getQuestions);

//* DELETE - /questions/:id** - borra una entrada | Token obligatorio y mismo usuario.
app.delete("/questions/:id",isUser, deleteQuestions)


//& Endpoints Answers

//* POST - /answers** - crea una respuesta | Token obligatorio y solo si es especialista
app.post("/answers", isUser, isExpert, newAnswers);

//& Errores
app.use((error, req, res, next) => {
  res.status(error.httpStatus || 500).send({
    status: "Error",
    message: error.message,
  });
});


app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
