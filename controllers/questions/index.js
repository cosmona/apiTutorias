'use strict'

const newQuestions = require("./newQuestions");				//& Crea preguntas
const getAllQuestions = require("./getAllQuestions");		//& Muestra todas las preguntas
const getQuestions = require("./getQuestions");				//& Muestra una pregunta
const editQuestions = require("./editQuestions");			//& Edita una pregunta
const deleteQuestions = require("./deleteQuestions");		//& Borra una pregunta

module.exports = { newQuestions, getAllQuestions, getQuestions, editQuestions, deleteQuestions };
