/*

This file contains the schema for the projects smart_farming.

*/

-- Create database and drop if exists

DROP DATABASE IF EXISTS `smart-farming`;
CREATE DATABASE `smart-farming`;

-- Use database

USE `smart-farming`;

-- Table: greenhouse

DROP TABLE IF EXISTS greenhouse;
CREATE TABLE greenhouse (
    id INT PRIMARY KEY AUTO_INCREMENT,
    diameter FLOAT NOT NULL,
    latitude FLOAT NOT NULL,
    logitude FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: device_group

DROP TABLE IF EXISTS device_group;
CREATE TABLE device_group (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    greenhouse_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: device

DROP TABLE IF EXISTS device;
CREATE TABLE device (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    mac_adr VARCHAR(255) NOT NULL,
    registered BOOLEAN NOT NULL,
    device_group_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: sensor
DROP TABLE IF EXISTS sensor;
CREATE TABLE sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    device_id INT NOT NULL,
    sensor_type_id INT DEFAULT NULL,
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

-- Table: measurement_units

DROP TABLE IF EXISTS measurement_units;
CREATE TABLE measurement_units (
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
    sensor_id INT NOT NULL,
    unit_id INT NOT NULL,
    graph_type VARCHAR(255) DEFAULT "value" -- value, progress, gauge
);

-- Table : images

DROP TABLE IF EXISTS images;
CREATE TABLE images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sensor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign keys

ALTER TABLE device_group ADD FOREIGN KEY (greenhouse_id) REFERENCES greenhouse(id);
ALTER TABLE device ADD FOREIGN KEY (device_group_id) REFERENCES device_group(id);

ALTER TABLE sensor ADD FOREIGN KEY (device_id) REFERENCES device(id);
ALTER TABLE sensor ADD FOREIGN KEY (sensor_type_id) REFERENCES sensor_type(id);

ALTER TABLE measurements ADD FOREIGN KEY (sensor_id) REFERENCES sensor(id);
ALTER TABLE measurements ADD FOREIGN KEY (unit_id) REFERENCES measurement_units(id);

ALTER TABLE unit_links ADD FOREIGN KEY (sensor_id) REFERENCES sensor(id);
ALTER TABLE unit_links ADD FOREIGN KEY (unit_id) REFERENCES measurement_units(id);

ALTER TABLE images ADD FOREIGN KEY (sensor_id) REFERENCES sensor(id);

ALTER TABLE sensor_type ADD FOREIGN KEY (unit_id) REFERENCES measurement_units(id);

-- Add sample greenhouse

INSERT INTO greenhouse (diameter, latitude, logitude) VALUES (10, 47.3, 0.7);
INSERT INTO device_group (name, greenhouse_id) VALUES ('Sans groupe', 1);

-- Add sample units

INSERT INTO measurement_units (name, symbol, lower_bound, upper_bound) VALUES ('Temperature', '°C', -20, 50);
INSERT INTO measurement_units (name, symbol, lower_bound, upper_bound) VALUES ('Humidity', '%', 0, 100);

INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (4, 'Battery capacity', '%', 0, 100);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (5, 'Battery voltage', 'V', 2, 4);

INSERT INTO measurement_units (name, symbol, lower_bound, upper_bound) VALUES ('Red light', '', 0, 255);
INSERT INTO measurement_units (name, symbol, lower_bound, upper_bound) VALUES ('Green light', '', 0, 255);
INSERT INTO measurement_units (name, symbol, lower_bound, upper_bound) VALUES ('Blue light', '', 0, 255);

-- Add test devices

INSERT INTO device (id, name, mac_adr, registered, device_group_id) VALUES (2, 'Test device', '0', 1, 1);

INSERT INTO sensor(id, name, device_id) VALUES (2, 'Battery ADC', 2);
INSERT INTO sensor(id, name, device_id) VALUES (6, 'Temperature', 2);

INSERT INTO unit_links(sensor_id, unit_id, graph_type) VALUES (2, 5, 'value');
INSERT INTO unit_links(sensor_id, unit_id, graph_type) VALUES (2, 4, 'doughnut');
INSERT INTO unit_links(sensor_id, unit_id, graph_type) VALUES (6, 1, 'doughnut');