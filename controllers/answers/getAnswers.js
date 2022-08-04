"use strict";

const connectDB = require("../../db/db");

const getAnswers = async (req, res, next) => {
  let connection;

  console.log("OOOmmmpa");
  try {
    // pedir connection al DB
    connection = await connectDB();

    //Recoger parametros
    const { title, technology, questionDate, answered } = req.query;

    const [listQuestions] = await connection.query(consult);

    res.send({
      status: "ok",
      message: "Questions mostradas",
      data: listQuestions,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getAnswers;
