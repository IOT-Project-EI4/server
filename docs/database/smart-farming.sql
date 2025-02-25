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
    battery_level INT,
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
    unit_id INT NOT NULL
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

INSERT INTO measurement_units (name, symbol, lower_bound, upper_bound) VALUES ('Current', 'A', 0, 10);
INSERT INTO measurement_units (name, symbol, lower_bound, upper_bound) VALUES ('Capacity', 'mA', 0, 10000);

INSERT INTO measurement_units (name, symbol, lower_bound, upper_bound) VALUES ('Voltage', 'V', 0, 10);

-- Add test devices

INSERT INTO device (name, mac_adr, registered, battery_level, device_group_id) VALUES ('Solar panel test device', '00:00:00:00:00:01', 1, 0, 1);
INSERT INTO sensor(name, device_id) VALUES ('Device 2 battery ADC', '1');
INSERT INTO unit_links(sensor_id, unit_id) VALUES (1, 5);