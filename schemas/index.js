"use strict";

const Joi = require("joi");

const registrationSchema = Joi.object().keys({
  email: Joi.string().required().email().max(100),
  password: Joi.string()
    .required()
    .min(6)
    .max(20)
    .error(new Error("Password needs to be over 6 and under 20 characters")),
});
const usernameSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .email()
    .max(100)
    .error(new Error("Email required: please introduce a valid email")),
});
const passwordSchema = Joi.object().keys({
  password: Joi.string()
    .required()
    .min(6)
    .max(20)
    .error(new Error("Password needs to be over 6 and under 20 characters")),
});

module.exports = { registrationSchema, usernameSchema, passwordSchema };
