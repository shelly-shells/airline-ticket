CREATE DATABASE flightBooking;

USE flightBooking;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    pwd VARCHAR(200) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    mobileNo VARCHAR(10) UNIQUE CHECK (mobileNo REGEXP '^[0-9]{10}$'),
    emailID VARCHAR(100) UNIQUE,
    age INT CHECK (
        age > 18
        AND age < 100
    ) NOT NULL,
    gender enum('M', 'F', 'O') NOT NULL,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cities (
    cityName VARCHAR(100),
    airportName VARCHAR(100),
    cityID VARCHAR(3) PRIMARY KEY,
    uTime TIMESTAMP,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE TABLE flights (
    aircraftID VARCHAR(8) PRIMARY KEY CHECK (aircraftID REGEXP '^[A-Z]{2}\s[0-9]{3,4}$'),
    model VARCHAR(50),
    economy INT,
    business INT,
    uTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE TABLE routes (
    id VARCHAR(10) PRIMARY KEY,
    departureAirportCode VARCHAR(3),
    arrivalAirportCode VARCHAR(3),
    departureTime TIMESTAMP,
    arrivalTime TIMESTAMP,
    aircraftID VARCHAR(8),
    monday BOOLEAN DEFAULT FALSE,
    tuesday BOOLEAN DEFAULT FALSE,
    wednesday BOOLEAN DEFAULT FALSE,
    thursday BOOLEAN DEFAULT FALSE,
    friday BOOLEAN DEFAULT FALSE,
    saturday BOOLEAN DEFAULT FALSE,
    sunday BOOLEAN DEFAULT FALSE,
    basePrice NUMERIC(10, 2),
    uTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE,
    FOREIGN KEY (aircraftID) REFERENCES flights(aircraftID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (departureAirportCode) REFERENCES cities(cityID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (arrivalAirportCode) REFERENCES cities(cityID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE bookings (
    bookingID INT PRIMARY KEY,
    username VARCHAR(50),
    flightID VARCHAR(8),
    date_ DATE DEFAULT CURRENT_DATE(),
    adults INT,
    children INT,
    amountPaid NUMERIC(10, 2),
    food BOOLEAN DEFAULT FALSE,
    extraLuggage BOOLEAN DEFAULT FALSE,
    timestamp_ TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    username VARCHAR(50),
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    age INT,
    gender VARCHAR(10),
    passengerNo INT,
    PRIMARY KEY (bookingID, passengerNo),
    updatedBy VARCHAR(50),
    FOREIGN KEY (bookingID) REFERENCES bookings(bookingID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    FOREIGN KEY (updatedBy) REFERENCES users(username)
    ON UPDATE CASCADE 
    ON DELETE CASCADE
);

CREATE ROLE user;

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