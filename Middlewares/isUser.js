'use strict';

const jwt = require('jsonwebtoken');

const { generateError } = require('../helpers');
const connectDB = require('../db/db');

const isUser = async (req, res, next) => {
  let connection;

  try {
    // pido conneción al DB
    connection = await connectDB();

    const { authorization } = req.headers;

    // si no tengo Authorization salgo con un error
    if (!authorization) {
        const error = new Error("No estás autorizado");
        error.httpStatus = 401;
        throw error;
    }

    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.JWT_SECRET);
    } catch (error) {
      generateError('Token no valido', 401);
    }

    // comprobamos que el token sea valido respecto a lastAuthUpdate
    /* const [user] = await connection.query(
      `
      SELECT lastAuthUpdate
      FROM users
      WHERE id=?
      `,
      [tokenInfo.id]
    );

    const lastAuthUpdate = new Date(user[0].lastAuthUpdate);
    const timestampCreateToken = new Date(tokenInfo.iat * 1000);

    if (timestampCreateToken < lastAuthUpdate) {
      generateError('Token caducado', 401);
    } */

    // añadimos en la request (req) el tokenInfo
    req.userToken = tokenInfo;

    // continuo
    next();
  } catch (error) {
    //throw error;
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isUser;