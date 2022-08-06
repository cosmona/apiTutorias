"use strict";

const userExists = require("../middlewares/userExists"); 		//& mira si existe un usuario
const isUser = require("../middlewares/isUser");				//& Comprueba token
const isExpert = require("../middlewares/isExpert");			//& Comprueba si el rol es Experto

module.exports = { userExists, isUser, isExpert };
