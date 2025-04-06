/*

This file contains the sample data for the projects smart_farming.

*/

-- Use database

USE `smart-farming`;

-- Add sample greenhouse

INSERT INTO greenhouse (diameter, latitude, logitude) VALUES (10, 47.3, 0.7);
INSERT INTO device_group (name, greenhouse_id) VALUES ('Sans groupe', 1);

-- Add sample units

INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (1, 'Temperature', '°C', -20, 50);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (2, 'Humidity', '%', 0, 100);

INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (5, 'Battery voltage', 'V', 2, 4);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (6, 'Battery capacity', '%', 0, 100);

INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (8, 'Red light', '', 0, 255);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (9, 'Green light', '', 0, 255);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (10, 'Blue light', '', 0, 255);

INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (11, 'Temperature lowerground', '°C', -20, 50);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (12, 'Temperature upperground', '°C', -20, 50);

INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (13, 'Humidity lowerground', '%', 0, 100);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (14, 'Humidity upperground', '%', 0, 100);

INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (15, 'CO2', 'ppm', 0, 5000);

INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (16, 'Light intensity', ' lux', 0, 50000);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (17, 'Light color', 'K', 0, 8000);
INSERT INTO measurement_units (id, name, symbol, lower_bound, upper_bound) VALUES (18, 'Light color 2', 'K', 0, 10000);

-- Add test devices

INSERT INTO device (id, name, mac_adr, registered, device_group_id) VALUES (2, 'Test device', '0', 1, 1);

-- Add sensors

INSERT INTO sensor (id, name, device_id, sensor_type_id) VALUES (2, 'Battery ADC', 2, NULL);

INSERT INTO sensor (id, name, device_id, sensor_type_id) VALUES (5, 'Inground humidity', 2, NULL);
INSERT INTO sensor (id, name, device_id, sensor_type_id) VALUES (6, 'Inground temperature', 2, NULL);

INSERT INTO sensor (id, name, device_id, sensor_type_id) VALUES (8, 'CO2 sensor', 2, NULL);

INSERT INTO sensor (id, name, device_id, sensor_type_id) VALUES (9, 'Light color', 2, NULL);
INSERT INTO sensor (id, name, device_id, sensor_type_id) VALUES (10, 'Light intensity', 2, NULL);

-- Add unit links

INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (1, 2, 5, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (4, 6, 11, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (5, 6, 12, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (6, 5, 13, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (7, 8, 15, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (8, 8, 1, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (9, 8, 2, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (10, 9, 8, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (11, 9, 9, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (12, 9, 10, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (13, 9, 17, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (16, 9, 18, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (14, 2, 6, 'value');
INSERT INTO unit_links(id, sensor_id, unit_id, graph_type) VALUES (15, 10, 16, 'value');