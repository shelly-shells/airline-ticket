CREATE DATABASE flightBooking;
USE flightBooking;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    pwd VARCHAR(100) NOT NULL,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    mobileNo VARCHAR(15),
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
);

CREATE TABLE flights (
    aircraftID int PRIMARY KEY,
    model VARCHAR(50),
    business INT,
    economy INT,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
);

CREATE TABLE routes (
    id int PRIMARY KEY,
    aircraftID INT REFERENCES flights(aircraftID),
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
    FOREIGN KEY (updatedBy) REFERENCES users(username)
);

CREATE TABLE bookings (
    bookingID int PRIMARY KEY,
    username VARCHAR(50) REFERENCES users(username),
    flightID INT REFERENCES routes(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adults INT,
    children INT,
    amountPaid NUMERIC(10, 2),
    food BOOLEAN DEFAULT FALSE,
    extraLuggage BOOLEAN DEFAULT FALSE,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
);

CREATE TABLE bookingDetails (
    bookingID INT REFERENCES bookings(bookingID),
    passengerNo int,
    PRIMARY KEY (bookingID, passengerNo),
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    gender VARCHAR(10),
    age INT,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
);

ALTER TABLE routes ADD CONSTRAINT fk_departure_city FOREIGN KEY (departureAirportCode) REFERENCES cities(cityID);
ALTER TABLE routes ADD CONSTRAINT fk_arrival_city FOREIGN KEY (arrivalAirportCode) REFERENCES cities(cityID);

CREATE ROLE users;
CREATE ROLE adm;
CREATE ROLE sys;

GRANT SELECT ON cities TO users;
GRANT SELECT ON flights TO users;
GRANT SELECT ON routes TO users;
GRANT SELECT ON bookings TO users;

GRANT ALL PRIVILEGES ON flightBooking.* TO adm;

GRANT SELECT, INSERT, UPDATE ON users TO sys;
