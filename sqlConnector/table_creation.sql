CREATE DATABASE flightBooking;

USE flightBooking;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    pwd VARCHAR(200) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    mobileNo VARCHAR(10) UNIQUE CHECK (mobileNo REGEXP '^[0-9]{10}$'),
    emailID VARCHAR(100) UNIQUE,
    age INT,
    gender VARCHAR(10),
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
);

CREATE TABLE cities (
    cityID int PRIMARY KEY,
    cityName VARCHAR(100),
    airportName VARCHAR(100),
    uTime TIMESTAMP,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE TABLE flights (
    aircraftID int PRIMARY KEY CHECK (aircraftID REGEXP '^[A-Z]{2}\s[0-9]{3,4}$'),
    model VARCHAR(50),
    business INT,
    economy INT,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE TABLE routes (
    id int PRIMARY KEY,
    departureAirportCode INT,
    arrivalAirportCode INT,
    departureTime TIMESTAMP,
    arrivalTime TIMESTAMP,
    aircraftID INT,
    monday BOOLEAN DEFAULT FALSE,
    tuesday BOOLEAN DEFAULT FALSE,
    wednesday BOOLEAN DEFAULT FALSE,
    thursday BOOLEAN DEFAULT FALSE,
    friday BOOLEAN DEFAULT FALSE,
    saturday BOOLEAN DEFAULT FALSE,
    sunday BOOLEAN DEFAULT FALSE,
    basePrice NUMERIC(10, 2),
    updatedBy VARCHAR(50),
    FOREIGN KEY (aircraftID) REFERENCES flights(aircraftID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE TABLE bookings (
    bookingID int PRIMARY KEY,
    username VARCHAR(50),
    flightID INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adults INT,
    children INT,
    amountPaid NUMERIC(10, 2),
    food BOOLEAN DEFAULT FALSE,
    extraLuggage BOOLEAN DEFAULT FALSE,
    updatedBy VARCHAR(50),
    FOREIGN KEY (username) REFERENCES users(username)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (flightID) REFERENCES routes(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
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

CREATE ROLE adm;

CREATE ROLE sys;

CREATE USER 'user' @'localhost' IDENTIFIED BY 'password';

CREATE USER 'admin' @'localhost' IDENTIFIED BY 'admin';

CREATE USER 'sys' @'localhost' IDENTIFIED BY 'sys';

GRANT
SELECT
    ON flightBooking.cities TO users;

GRANT
SELECT
    ON flightBooking.flights TO users;

GRANT
SELECT
    ON flightBooking.routes TO users;

GRANT
SELECT
    ON flightBooking.bookings TO users;

GRANT
SELECT
    ON flightBooking.* TO 'user' @'localhost';

GRANT ALL PRIVILEGES ON flightBooking.* TO adm;

GRANT
SELECT
,
INSERT
,
UPDATE
    ON flightBooking.users TO sys;

GRANT 'users' TO 'user' @'localhost';
GRANT 'sys' TO 'sys' @'localhost';
GRANT 'adm' TO 'admin' @'localhost';
FLUSH PRIVILEGES;