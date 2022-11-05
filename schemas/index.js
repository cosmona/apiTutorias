"use strict";

const Joi = require("joi");

const registrationSchema = Joi.object().keys({
  email: Joi.string().required().email().max(100),
  password: Joi.string()
    .required()
    .min(6)
    .max(20)
    .error(new Error("La password tiene que ser de entre 6 y 20 caracteres")),
});
const usernameSchema = Joi.object().keys({
  email: Joi.string().required().email().max(100),
});
const passwordSchema = Joi.object().keys({
  password: Joi.string()
    .required()
    .min(6)
    .max(20)
    .error(new Error("La password tiene que ser de entre 6 y 20 caracteres")),
});

module.exports = { registrationSchema, usernameSchema, passwordSchema };
