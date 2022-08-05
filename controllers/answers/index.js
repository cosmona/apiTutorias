'use strict'

const newAnswers = require("./newAnswers");			//& Crea respuestas
const getAnswers = require("./getAnswers"); 		//& Muestra respuestas
const editAnswers = require("./editAnwsers");		//& Edita respuestas
const deleteAnswers = require("./deleteAnswers")	//& Borra respuestas

module.exports = { newAnswers, getAnswers, editAnswers, deleteAnswers };
