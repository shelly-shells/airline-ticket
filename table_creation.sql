CREATE DATABASE flight_booking;
USE flight_booking;

CREATE TABLE Cities (
    cityID SERIAL PRIMARY KEY,
    cityName VARCHAR(100),
    airportName VARCHAR(100)
);

CREATE TABLE Flights (
    aircraftID SERIAL PRIMARY KEY,
    model VARCHAR(50),
    business INT,
    economy INT
);

CREATE TABLE Routes (
    id SERIAL PRIMARY KEY,
    aircraftID INT REFERENCES Flights(aircraftID),
    departureAirportCode VARCHAR(10),
    arrivalAirportCode VARCHAR(10),
    departureTime TIMESTAMP,
    arrivalTime TIMESTAMP,
    basePrice NUMERIC(10, 2),
    monday BOOLEAN DEFAULT FALSE,
    tuesday BOOLEAN DEFAULT FALSE,
    wednesday BOOLEAN DEFAULT FALSE,
    thursday BOOLEAN DEFAULT FALSE,
    friday BOOLEAN DEFAULT FALSE,
    saturday BOOLEAN DEFAULT FALSE,
    sunday BOOLEAN DEFAULT FALSE
);

CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    mobileNo VARCHAR(15),
    emailID VARCHAR(100) UNIQUE,
    age INT,
    gender VARCHAR(10)
);

CREATE TABLE Bookings (
    bookingID SERIAL PRIMARY KEY,
    username VARCHAR(50) REFERENCES Users(username),
    flightID INT REFERENCES Routes(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adults INT,
    children INT,
    amountPaid NUMERIC(10, 2),
    food BOOLEAN DEFAULT FALSE,
    extraLuggage BOOLEAN DEFAULT FALSE
);

CREATE TABLE BookingDetails (
    bookingID INT REFERENCES Bookings(bookingID),
    passengerNo SERIAL PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    gender VARCHAR(10),
    age INT
);

ALTER TABLE Routes ADD CONSTRAINT fk_departure_city FOREIGN KEY (departureAirportCode) REFERENCES Cities(cityID);
ALTER TABLE Routes ADD CONSTRAINT fk_arrival_city FOREIGN KEY (arrivalAirportCode) REFERENCES Cities(cityID);



CREATE ROLE user;
CREATE ROLE admin;
CREATE ROLE system;


GRANT SELECT ON Cities, Flights, Routes, Bookings TO user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

GRANT SELECT, INSERT, UPDATE ON Cities, Flights, Routes, Users, Bookings, BookingDetails TO system;

GRANT CREATE, ALTER ON DATABASE your_database TO system;
