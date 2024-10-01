CREATE DATABASE flight_booking;
USE flight_booking;

CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
    pwd VARCHAR(100) NOT NULL,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    mobileNo VARCHAR(15),
    emailID VARCHAR(100) UNIQUE,
    age INT,
    gender VARCHAR(10),
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES Users(username)
);


CREATE TABLE Cities (
    cityID int PRIMARY KEY,
    cityName VARCHAR(100),
    airportName VARCHAR(100),
    u_time TIMESTAMP,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES Users(username)
);

CREATE TABLE Flights (
    aircraftID int PRIMARY KEY,
    model VARCHAR(50),
    business INT,
    economy INT,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES Users(username)
);

CREATE TABLE Routes (
    id int PRIMARY KEY,
    aircraftID INT REFERENCES Flights(aircraftID),
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
    FOREIGN KEY (updatedBy) REFERENCES Users(username)
);

CREATE TABLE Bookings (
    bookingID int PRIMARY KEY,
    username VARCHAR(50) REFERENCES Users(username),
    flightID INT REFERENCES Routes(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adults INT,
    children INT,
    amountPaid NUMERIC(10, 2),
    food BOOLEAN DEFAULT FALSE,
    extraLuggage BOOLEAN DEFAULT FALSE,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES Users(username)
);

CREATE TABLE BookingDetails (
    bookingID INT REFERENCES Bookings(bookingID),
    passengerNo int PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    gender VARCHAR(10),
    age INT,
    updatedBy VARCHAR(50),
    FOREIGN KEY (updatedBy) REFERENCES Users(username)
);

ALTER TABLE Routes ADD CONSTRAINT fk_departure_city FOREIGN KEY (departureAirportCode) REFERENCES Cities(cityID);
ALTER TABLE Routes ADD CONSTRAINT fk_arrival_city FOREIGN KEY (arrivalAirportCode) REFERENCES Cities(cityID);

CREATE ROLE users;
CREATE ROLE adm;
CREATE ROLE sys;

GRANT SELECT ON Cities TO users;
GRANT SELECT ON FLights TO users;
GRANT SELECT ON Routes TO users;
GRANT SELECT ON Bookings TO users;

GRANT ALL PRIVILEGES ON flight_booking.* TO adm;

GRANT SELECT, INSERT, UPDATE ON Users TO sys;
