"use strict";

const isUser = require("../middlewares/isUser");				//& Comprueba token
const isExpert = require("../middlewares/isExpert");			//& Comprueba si el rol es Experto

module.exports = { isUser, isExpert };
