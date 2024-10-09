CREATE DATABASE flightBooking;

USE flightBooking;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password_encrypt VARCHAR(200) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    mobileNo VARCHAR(10) UNIQUE CHECK (mobileNo REGEXP '^[0-9]{10}$'),
    email VARCHAR(100) UNIQUE,
    age INT CHECK (
        age >= 18
        AND age < 100
    ) NOT NULL,
    gender enum('M', 'F', 'O') NOT NULL,
    role enum('user', 'admin') DEFAULT 'user',
    uTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cities (
    cityID VARCHAR(3) PRIMARY KEY,
    cityName VARCHAR(100),
    airportName VARCHAR(100),
    uTime TIMESTAMP,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE flights (
    aircraftID VARCHAR(8) PRIMARY KEY CHECK (aircraftID REGEXP '[A-Z0-9]{3}'),
    model VARCHAR(50),
    business INT,
    economy INT,
    updatedBy VARCHAR(50),
    uTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updatedBy) REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE routes (
    id int PRIMARY KEY,
    aircraftID INT,
    departureAirportCode INT,
    arrivalAirportCode INT,
    departureTime TIMESTAMP,
    arrivalTime TIMESTAMP,
    basePrice NUMERIC(10, 2),
    monday BOOLEAN DEFAULT FALSE,
    tuesday BOOLEAN DEFAULT FALSE,
    wednesday BOOLEAN DEFAULT FALSE,
    thursday BOOLEAN DEFAULT FALSE,
    friday BOOLEAN DEFAULT FALSE,
    saturday BOOLEAN DEFAULT FALSE,
    sunday BOOLEAN DEFAULT FALSE,
    updatedBy VARCHAR(50),
    uTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updatedBy) REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE bookings (
    bookingID INT PRIMARY KEY,
    username VARCHAR(50) REFERENCES users(username),
    flightID VARCHAR(8) REFERENCES routes(id),
    date DATE,
    adults INT,
    children INT,
    amountPaid NUMERIC(10, 2),
    food BOOLEAN DEFAULT FALSE,
    extraLuggage BOOLEAN DEFAULT FALSE,
    uTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (flightID) REFERENCES routes(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE bookingDetails (
    bookingID INT,
    passengerNo int,
    PRIMARY KEY (bookingID, passengerNo),
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    gender VARCHAR(10),
    age INT,
    updatedBy VARCHAR(50),
    FOREIGN KEY (bookingID) REFERENCES bookings(bookingID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

ALTER TABLE
    routes
ADD
    CONSTRAINT fk_departure_city FOREIGN KEY (departureAirportCode) REFERENCES cities(cityID)
    ON UPDATE CASCADE 
    ON DELETE CASCADE;

ALTER TABLE
    routes
ADD
    CONSTRAINT fk_arrival_city FOREIGN KEY (arrivalAirportCode) REFERENCES cities(cityID)
    ON UPDATE CASCADE 
    ON DELETE CASCADE;

CREATE ROLE users;

CREATE ROLE admin;

CREATE ROLE sys;

GRANT
SELECT
    ON flightBooking.cities TO user;

GRANT
SELECT
    ON flightBooking.flights TO user;

GRANT
SELECT
    ON flightBooking.routes TO user;

GRANT
SELECT
    ON flightBooking.bookings TO user;

GRANT ALL PRIVILEGES ON flightBooking.* TO admin;

GRANT USAGE ON flightBooking.* TO admin;

GRANT
SELECT
,
INSERT
,
UPDATE
    ON flightBooking.users TO sys;

CREATE USER 'user' @'localhost' IDENTIFIED BY 'user';

CREATE USER 'admin' @'localhost' IDENTIFIED BY 'admin';

CREATE USER 'sys' @'localhost' IDENTIFIED BY 'sys';

GRANT user TO 'user' @'localhost';

GRANT sys TO 'sys' @'localhost';

GRANT admin TO 'admin' @'localhost';

FLUSH PRIVILEGES;