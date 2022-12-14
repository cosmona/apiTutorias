"use strict";

require("dotenv").config();
const { format } = require("date-fns");
const connectDB = require("./db");

let connection;

async function main() {
  try {
    connection = await connectDB();

    // BORRAR TABLAS
    console.log("Borrando tablas....");

    await connection.query("DROP TABLE IF EXISTS answer_votes;");
    await connection.query("DROP TABLE IF EXISTS answers;");
    await connection.query("DROP TABLE IF EXISTS questions;");
    await connection.query("DROP TABLE IF EXISTS users;");

    //CREAR TABLAS

    await connection.query(`
		CREATE TABLE users
		(
			ID INTEGER PRIMARY KEY AUTO_INCREMENT, 
			CreationDate DATETIME NOT NULL,
			Username VARCHAR(100) NOT NULL,
			Email VARCHAR(100) UNIQUE NOT NULL,
			Password VARCHAR(512) NOT NULL,
			UserRole ENUM("Student", "Expert") DEFAULT "Student" NOT NULL,
			Activation BOOLEAN DEFAULT false,
			RegistrationCode VARCHAR(50),
			Technology ENUM("HTML", "CSS", "JavaScript", "SQL", "Node", "React") DEFAULT null,
			Deleted BOOLEAN DEFAULT false,
			LastAuthUpdate DATETIME,
			RecoverCode VARCHAR(100)
		);
		`);

    console.log("Finalizado users");

    await connection.query(`
		CREATE TABLE questions 
		(
			ID INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
			QuestionDate DATETIME NOT NULL,
			Title TEXT NOT NULL,
			Question TEXT NOT NULL,
			User_ID INTEGER NOT NULL,
			Technology ENUM("HTML", "CSS", "JavaScript", "SQL", "Node", "React") DEFAULT null,
			Answered BOOLEAN default false,
			FOREIGN KEY (User_id) REFERENCES users(ID)
			);
			`);

    console.log("Finalizado questions");

    await connection.query(`
			CREATE TABLE answers
			(
				ID INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
				AnswerDate DATETIME NOT NULL,
				Answer TEXT NOT NULL,
				User_ID INTEGER NOT NULL,
				Question_ID INTEGER NOT NULL,
				FOREIGN KEY (User_id) REFERENCES users(ID),
				FOREIGN KEY (Question_ID) REFERENCES questions(ID)
			);		
		`);

    console.log("Finalizado answers");

    await connection.query(`
			CREATE TABLE answer_votes (
				ID INT PRIMARY KEY AUTO_INCREMENT,
				Date DATETIME NOT NULL,
				Vote TINYINT NOT NULL,
				Answer_ID INT NOT NULL,
				FOREIGN KEY (Answer_ID) REFERENCES answers(ID),
				CHECK (Vote IN (1,2,3,4,5)),
				User_ID INT NOT NULL,
				FOREIGN KEY (User_ID) REFERENCES users(ID),
				UNIQUE(Answer_id,User_id)
			);		
		`);

    console.log("Finalizado answer_votes");

    //CREAR UN USUARIO DE CADA
    const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    await connection.query(
      `
				INSERT INTO users (
					CreationDate,
					Username,
					Email,
					Password,
					UserRole,
					Activation,
					Technology,
					LastAuthUpdate
				) VALUES (?,?,?,SHA2(?, 512),?,?,?,?)
		`,
      [
        creationDate,
        "Profesor",
        "profesor@gmail.com",
        "123456789",
        "Expert",
		"1",
        "CSS",
        creationDate,
      ]
    );

    console.log("Finalizado profesor - profesor@gmail.com : pass:123456789");

    await connection.query(
      `
				INSERT INTO users (
					CreationDate,
					Username,
					Email,
					Password,
					UserRole,
					Activation,
					LastAuthUpdate
				) VALUES (?,?,?,SHA2(?, 512),?,?,?)
		`,
      [
        creationDate,
        "Alumno",
        "alumno@gmail.com",
        "123456789",
        "Student",
		"1",
        creationDate,
      ]
    );
    console.log("Finalizado alumno - alumno@gmail.com : pass:123456789");
  } catch (error) {
    console.error("ERROR:", error.message);
  } finally {
    if (connection) {
      connection.release();
    }
    process.exit();
  }
}

main();
