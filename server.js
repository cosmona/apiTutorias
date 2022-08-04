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
} = require("./controllers/users");
const {
  newQuestions,
  getAllQuestions,
  getQuestions,
} = require("./controllers/questions");
const { newAnswers } = require("./controllers/answers/index");

const app = express();

//* Middlewares
const { isUser, userExists, isExpert } = require("./Middlewares");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});

//* Endpoints USers

app.post("/users", newUsers);

app.get("/users/validate/:RegistrationCode", validateUsers);

app.post("/users/login/", loginUsers);

app.put("/users", isUser, userEdit);

//* Endpoints Questions

app.post("/questions", isUser, newQuestions);

app.get("/questions/:id", getQuestions);

app.get("/questions", getAllQuestions);

//* Endpoints Answers

app.post("/answers", isUser, isExpert, newAnswers);

//*errores
app.use((error, req, res, next) => {
  res.status(error.httpStatus || 500).send({
    status: "Error",
    message: error.message,
  });
});
