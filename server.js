"use strict";

//* Dependencias
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const { newUsers } = require("./controllers/users");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});

//* Endpoints

app.post("/users", newUsers);

//*errores
app.use((error, req, res, next) => {
  res.status(error.httpStatus || 500).send({
    status: "Error",
    message: error.message,
  });
});
