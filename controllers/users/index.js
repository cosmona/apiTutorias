"use strict";
const newUsers = require("./newUsers");				//& Crea usuario
const validateUsers= require("./validateUsers");	//& Valida usuario
const loginUsers= require("./loginUsers");			//& Login usuario
const userEdit= require("./userEdit");				//& Edita un usuario

module.exports = { newUsers, validateUsers, loginUsers, userEdit };
