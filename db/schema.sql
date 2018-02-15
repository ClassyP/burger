### Schema
CREATE DATABASE buger_db;
USE burger_db;
CREATE TABLE epicbuger
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	sleepy BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
);