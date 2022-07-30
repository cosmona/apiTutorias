CREATE DATABASE Alejandria;

USE Alejandria;

-- users, preguntas, respuestas

CREATE TABLE users
(
	ID INTEGER PRIMARY KEY AUTO_INCREMENT, 
    CreationDate DATETIME NOT NULL,
    Username VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(512) NOT NULL,
    UserRole ENUM("Student", "Expert") DEFAULT "Student" NOT NULL,
    Activation BOOLEAN DEFAULT false,
    Technology ENUM("HTML", "CSS", "JavaScript", "SQL", "Node", "React") DEFAULT null,
    Deleted BOOLEAN DEFAULT false,
    LastAuthUpdate DATETIME,
    RecoverCode VARCHAR(100)
);

CREATE TABLE questions 
(
	ID INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    QuestionDate DATETIME NOT NULL,
    Question TEXT NOT NULL,
    User_ID INTEGER NOT NULL,
    Technology ENUM("HTML", "CSS", "JavaScript", "SQL", "Node", "React") DEFAULT null,
    Answered BOOLEAN default false,
	FOREIGN KEY (User_id) REFERENCES users(ID)
);

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

CREATE TABLE answer_votes (
	ID INT PRIMARY KEY AUTO_INCREMENT,
	Date DATETIME NOT NULL,
	Vote TINYINT NOT NULL,
	Question_ID INT NOT NULL,
	FOREIGN KEY (Question_ID) REFERENCES questions(ID),
	CHECK (Vote IN (1,2,3,4,5)),
	User_ID INT NOT NULL,
	FOREIGN KEY (User_ID) REFERENCES users(ID)
);

