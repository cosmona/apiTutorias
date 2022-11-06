"use strict";

//^ Importamos funcion que conecta a la BD
const connectDB = require("../../db/db");

//^ Importa funcion que genera errores
const { generateErrors } = require("../../helpers");

//& muestra preguntas
const getAnswers = async (req, res, next) => {
  let connection;

  try {
    //* Conexion al DB
    connection = await connectDB();

    //* Recuperar parametros
    const { id } = req.params;

    //~ Consulta SQL de la respuesta por id
    const [answer] = await connection.query(
      `
      SELECT *
      FROM  answers
      WHERE ID = ?
      `,
      [id]
    );

    //* Error
    if (!answer[0]) {
      await generateErrors("No se han encontrado respuestas", 401);
    }

    console.log("andwer ID", answer[0].ID);

    let ansID = [];
    //* extrae el id de las respuestas mostradas
    let votes = answer.map((answ) => {
      ansID.push(answ.ID);
    });

    console.log("ansID", ansID);
    //* con el id de las respuestas, extrae los votos y los guarda en un array
    let allVotes = [];
    for (let i = 0; i < ansID.length; i++) {
      //* extrae votos de la respuesta i
      const [currentvote] = await connection.query(
        `
            SELECT *
            FROM  answer_votes
            WHERE Answer_ID = ?
            `,
        [ansID[i]]
      );
      //* inicializa valores
      let media = 0;
      let j = 0;
      //*extrae los votos que sean answer_id i
      for (j; j < currentvote.length; j++) {
        media += currentvote[j].Vote;
      }
      //* saca la media de
      media = media / j;

      const mediaObj = {
        Answer_ID: ansID[i],
        media: media,
      };

      console.log("ID: media", ansID[i], media);

      //* agrega a la edia a los datos obtenidos en currentvotes
      // allVotes.push(ansID[i]);
      // allVotes.push(currentvote);
      //*
      currentvote.push(mediaObj);
      allVotes.push(mediaObj);
    }
    console.log("allVotes", allVotes);

    //* Devolvemos resultado
    res.send({
      status: "ok",
      message: "Respuestas mostradas",
      data: answer[0],
      votes: allVotes,
    });
  } catch (error) {
    next(error);
  } finally {
    //* Acaba la conexion
    if (connection) connection.release();
  }
};

module.exports = getAnswers;
