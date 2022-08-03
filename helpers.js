'use strict';


async function validate(schema, data) {
    try {
      await schema.validateAsync(data);
    } catch (error) {
      error.httpStatus = 400;
      throw error;
    }
  }

module.exports = {validate};