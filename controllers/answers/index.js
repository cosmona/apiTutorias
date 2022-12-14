"use strict";

const newAnswers = require("./newAnswers"); //& Crea respuestas
const getAnswers = require("./getAnswers"); //& Muestra respuestas
const getAnswer = require("./getAnswer"); //& Muestra respuestas
const editAnswers = require("./editAnwsers"); //& Edita respuestas
const deleteAnswers = require("./deleteAnswers"); //& Borra respuestas
const newVotes = require("./newVotes"); //& Crea voto para la respuesta
const getVotes = require("./getVotes"); //& Muestra los votos de una respuesta
const getMyAnswers = require("./getMyAnswers"); //& Muestra todas las respuestas del usuario logueado

module.exports = {
  newAnswers,
  getAnswers,
  editAnswers,
  deleteAnswers,
  newVotes,
  getAnswer,
  getMyAnswers,
  getVotes,
};
