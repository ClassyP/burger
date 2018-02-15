### Schema
CREATE DATABASE buger_db;
USE burger_db;
CREATE TABLE epicbuger
(
	id int NOT NULL AUTO_INCREMENT,
	burger_name varchar(255) NOT NULL,
	divoure BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
);