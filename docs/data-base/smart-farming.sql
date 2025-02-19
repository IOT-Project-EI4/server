/*

This file contains the schema for the projects smart_farming.

*/

-- Create database and drop if exists

DROP DATABASE IF EXISTS `smart-autonomous-system`;
CREATE DATABASE `smart-autonomous-system`;

-- Use database

USE `smart-autonomous-system`;

-- Table: serre

DROP TABLE IF EXISTS serre;
CREATE TABLE serre (
    id INT PRIMARY KEY AUTO_INCREMENT,
    diameter FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    logitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: serre_section

DROP TABLE IF EXISTS serre_section;
CREATE TABLE serre_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    serre_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: autonomous_system

DROP TABLE IF EXISTS autonomous_system;
CREATE TABLE autonomous_system (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    mac_adr VARCHAR(255) NOT NULL,
    registration_nb INT NOT NULL,
    battery_level INT,
    serre_section_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: sensor
DROP TABLE IF EXISTS sensor;
CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    mac_adr VARCHAR(255) NOT NULL,
    autonomous_system_id INT NOT NULL,
    sensor_type_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: sensor_type

DROP TABLE IF EXISTS sensor_type;
CREATE TABLE sensor_type (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    unit_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: measurements

DROP TABLE IF EXISTS measurements;
CREATE TABLE measurements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    value FLOAT NOT NULL,
    value_string VARCHAR(255) NOT NULL,
    sensor_id INT NOT NULL,
    unit_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: measurements_units

DROP TABLE IF EXISTS measurements_units;
CREATE TABLE measurements_units (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(255) NOT NULL,
    lower_bound FLOAT NOT NULL,
    upper_bound FLOAT NOT NULL
);

-- Table: unit_links

DROP TABLE IF EXISTS unit_links;
CREATE TABLE unit_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    mac_adr VARCHAR(255) NOT NULL,
    unit_id INT NOT NULL
);

--Table : photo

DROP TABLE IF EXISTS photo;
CREATE TABLE photo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sensor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Add foreign keys

ALTER TABLE serre_section ADD FOREIGN KEY (serre_id) REFERENCES serre(id);
ALTER TABLE autonomous_system ADD FOREIGN KEY (serre_section_id) REFERENCES serre_section(id);

ALTER TABLE sensor ADD FOREIGN KEY (autonomous_system_id) REFERENCES autonomous_system(id);
ALTER TABLE sensor ADD FOREIGN KEY (sensor_type_id) REFERENCES sensor_type(id);

ALTER TABLE measurements ADD FOREIGN KEY (sensor_id) REFERENCES sensor(id);
ALTER TABLE measurements ADD FOREIGN KEY (unit_id) REFERENCES measurements_units(id);

ALTER TABLE unit_links ADD FOREIGN KEY (unit_id) REFERENCES measurements_units(id);
ALTER TABLE photo ADD FOREIGN KEY (sensor_id) REFERENCES sensor(id);

ALTER TABLE sensor_type ADD FOREIGN KEY (unit_id) REFERENCES measurements_units(id);

-- Add sample serre

INSERT INTO serre (diameter, latitude, logitude) VALUES (10, 47.3, 0.7);
INSERT INTO serre_section (name, serre_id) VALUES ('Sans_section', 1);

-- Add sample units

INSERT INTO measurements_units (name, symbol, lower_bound, upper_bound) VALUES ('Temperature', '°C', -20, 50);
INSERT INTO measurements_units (name, symbol, lower_bound, upper_bound) VALUES ('Humidity', '%', 0, 100);

INSERT INTO measurements_units (name, symbol, lower_bound, upper_bound) VALUES ('Current', 'A', 0, 10);
INSERT INTO measurements_units (name, symbol, lower_bound, upper_bound) VALUES ('Capacity', 'mA', 0, 10000);

INSERT INTO measurements_units (name, symbol, lower_bound, upper_bound) VALUES ('Voltage', 'V', 0, 10);
