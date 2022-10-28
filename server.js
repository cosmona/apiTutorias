"use strict";

//* Dependencias
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

//* Controllers
const {
  newUsers,
  validateUsers,
  loginUsers,
  userEdit,
  userDelete,
  viewUsers,
} = require("./controllers/users");
const {
  newQuestions,
  getAllQuestions,
  getQuestions,
  editQuestions,
  deleteQuestions,
} = require("./controllers/questions");
const {
  newAnswers,
  deleteAnswers,
  editAnswers,
  newVotes,
  getAnswers,
  getAnswer,
  getMyAnswers,
  getVotes,
} = require("./controllers/answers");

//* Middlewares
const { isUser, isExpert } = require("./middlewares");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//* puerto desde el fichero de configuracion
const { PORT } = process.env;

//& Endpoints Users
//* GET - /users/** - mostrar usuarios
app.get("/users/:id", isUser, viewUsers); //* Lista un usuario -  Token  y Solo el propio usuario (+ o - datos)
app.get("/users/", viewUsers); //* Lista todos los usuarios

//* POST - /users/** - Crear el usuario
app.post("/users", newUsers);

//* POST - /users/validate/:RegistrationCode** - Validar el usuario
app.get("/users/validate/:RegistrationCode", validateUsers);

//* POST - /users/login** - Login de un usuario y devolverá el TOKEN
app.post("/users/login/", loginUsers);

//* PUT - /users/** - Editar un usuario | Token y Solo el propio usuario
app.put("/users", isUser, userEdit);

//* DELETE - /users/** - borra un usuario | Token obligatorio y mismo usuario
app.delete("/users", isUser, userDelete);

//& Endpoints Questions

//* GET - /questions** - Todas las entradas y buscar entradas | Sin token - questions?name=nombre&category=categoria&date=fecha&answer=true
app.get("/questions", getAllQuestions);

//* POST - /questions** - crea una entrada | Token obligatorio
app.post("/questions", isUser, newQuestions);

//* GET - /questions/:id** - JSON que muestra información de una entrada | Sin token
app.get("/questions/:id", getQuestions);

//* PUT - /questions/:id** - edita una entrada | Token obligatorio y mismo usuario.
app.put("/questions/:id", isUser, editQuestions);

//* DELETE - /questions/:id** - borra una entrada | Token obligatorio y mismo usuario.
app.delete("/questions/:id", isUser, deleteQuestions);

//& Endpoints Answers

//* POST - /answers** - crea una respuesta | Token obligatorio y solo si es especialista
app.post("/answers", isUser, isExpert, newAnswers);

//* GET - /answers/:id** muestra una respuesta
app.get("/answers/:id", getAnswers);

//* GET - /answer/:id** muestra todas las respuestas de una pregunta
app.get("/answer/:id", getAnswer);

//* GET - /myanswers/:id** muestra las respuestas del usuario logueado
app.get("/myanswers/:id", isUser, getMyAnswers);

//* DELETE - /answers/:id** - borra una respuesta | Token obligatorio y mismo usuario.
app.delete("/answers/:id", isUser, deleteAnswers);

//* PUT - /answers/:id** - edita una respuesta | Token obligatorio y mismo usuario.
app.put("/answers/:id", isUser, editAnswers);

//* POST  /answers/:id/votes - vota una respuesta | Token obligatorio pero cada usuario solo puede votar una vez y las
//*       entradas no pueden ser votadas por el usuario que las creó.

app.post("/answers/:id/votes", isUser, newVotes);

//* GET - /votes/:id** - muestra la media de una respuesta | id de la respuesta
app.get("/votes/:id", getVotes);

//& Error genérico
app.use((error, req, res, next) => {
  res.status(error.httpStatus || 500).send({
    status: "Error",
    message: error.message,
  });
});

//& Puerto en escucha
app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
