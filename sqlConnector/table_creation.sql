CREATE DATABASE flightBooking;

USE flightBooking;

-- Create Main Tables
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
    gender ENUM('M', 'F', 'O') NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
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
    id VARCHAR(8) PRIMARY KEY CHECK (id REGEXP '^[A-Z]{2}|6E [0-9]{3,4}$'),
    aircraftID VARCHAR(4) REFERENCES flights(aircraftID),
    departureAirportCode VARCHAR(3) NOT NULL REFERENCES cities(cityID),
    arrivalAirportCode VARCHAR(3) NOT NULL REFERENCES cities(cityID),
    departureTime TIME,
    arrivalTime TIME,
    basePrice NUMERIC(10, 2),
    Mon BOOLEAN DEFAULT FALSE,
    Tue BOOLEAN DEFAULT FALSE,
    Wed BOOLEAN DEFAULT FALSE,
    Thu BOOLEAN DEFAULT FALSE,
    Fri BOOLEAN DEFAULT FALSE,
    Sat BOOLEAN DEFAULT FALSE,
    Sun BOOLEAN DEFAULT FALSE,
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
    seatClass ENUM('Business', 'Economy') NOT NULL,
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
    gender ENUM('M', 'F', 'O') NOT NULL,
    age INT NOT NULL,
    FOREIGN KEY (bookingID) REFERENCES bookings(bookingID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE users_deleted LIKE users;

CREATE TABLE cities_deleted LIKE cities;

CREATE TABLE flights_deleted LIKE flights;

CREATE TABLE routes_deleted LIKE routes;

CREATE TABLE bookings_deleted LIKE bookings;

CREATE TABLE bookingDetails_deleted LIKE bookingDetails;

DELIMITER // 
CREATE TRIGGER before_users_delete 
BEFORE DELETE ON users 
FOR EACH ROW 
BEGIN
    INSERT INTO
        users_deleted
    SELECT
        *
    FROM
        users
    WHERE
        username = OLD.username;
END;
// 
CREATE TRIGGER before_cities_delete 
BEFORE DELETE ON cities 
FOR EACH ROW 
BEGIN
    INSERT INTO
        cities_deleted
    SELECT
        *
    FROM
        cities
    WHERE
        cityID = OLD.cityID;
END;

// 
CREATE TRIGGER before_flights_delete 
BEFORE DELETE ON flights 
FOR EACH ROW 
BEGIN
    INSERT INTO
        flights_deleted
    SELECT
        *
    FROM
        flights
    WHERE
        aircraftID = OLD.aircraftID;
END;

// 
CREATE TRIGGER before_routes_delete 
BEFORE DELETE ON routes 
FOR EACH ROW 
BEGIN
    INSERT INTO
        routes_deleted
    SELECT
        *
    FROM
        routes
    WHERE
        id = OLD.id;
END;

// 
CREATE TRIGGER before_bookings_delete 
BEFORE DELETE ON bookings 
FOR EACH ROW 
BEGIN
    INSERT INTO
        bookings_deleted
    SELECT
        *
    FROM
        bookings
    WHERE
        bookingID = OLD.bookingID;
END;

//
CREATE TRIGGER before_bookingDetails_delete 
BEFORE DELETE ON bookingDetails 
FOR EACH ROW 
BEGIN
    INSERT INTO
        bookingDetails_deleted
    SELECT
        *
    FROM
        bookingDetails
    WHERE
        bookingID = OLD.bookingID
        AND passengerNo = OLD.passengerNo;
END;

// 
DELIMITER ;

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

GRANT SUPER ON *.* TO 'admin' @'localhost';

FLUSH PRIVILEGES;

DELIMITER // 
CREATE PROCEDURE airportDetails(
    IN id VARCHAR(3),
    OUT airport VARCHAR(100),
    OUT city VARCHAR(100)
) 
BEGIN
    SELECT
        airportName,
        cityName INTO airport,
        city
    FROM
        cities
    WHERE
        cityID = id;
END // 
DELIMITER ;

DELIMITER // 
CREATE FUNCTION seatAvailability(
    flightID VARCHAR(8),
    date DATE,
    class ENUM('Business', 'Economy')
) 
RETURNS INT 
DETERMINISTIC 
BEGIN 
    DECLARE available INT;

    IF class = 'Economy' THEN
    SELECT
        flights.economy - COALESCE(SUM(bookings.adults + bookings.children), 0) INTO available
    FROM
        flights
        JOIN routes ON flights.aircraftID = routes.aircraftID
        JOIN bookings ON bookings.flightID = routes.id
    WHERE
        bookings.seatClass = 'Economy'
        AND bookings.flightID = flightID
        AND bookings.date = date
    GROUP BY
        bookings.flightID,
        bookings.date;

    ELSEIF class = 'Business' THEN
    SELECT
        flights.business - COALESCE(SUM(bookings.adults + bookings.children), 0) INTO available
    FROM
        flights
        JOIN routes ON flights.aircraftID = routes.aircraftID
        JOIN bookings ON bookings.flightID = routes.id
    WHERE
        bookings.seatClass = 'Business'
        AND bookings.flightID = flightID
        AND bookings.date = date
    GROUP BY
        bookings.flightID,
        bookings.date;

    END IF;

    RETURN available;
END // 
DELIMITER ;

DELIMITER //

CREATE FUNCTION getCities() 
RETURNS JSON
DETERMINISTIC
BEGIN
    DECLARE citiesList JSON;
    
    SET citiesList = (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('cityID', cityID, 'cityName', cityName)
        )
        FROM cities
    );

    RETURN citiesList;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE update_flight(
    IN p_aircraftID VARCHAR(8),
    IN p_model VARCHAR(50),
    IN p_business INT,
    IN p_economy INT,
    IN p_updatedBy VARCHAR(50),
    IN p_uTime TIMESTAMP
) 
BEGIN
    UPDATE
        flights
    SET
        model = p_model,
        business = p_business,
        economy = p_economy,
        updatedBy = p_updatedBy,
        uTime = p_uTime
    WHERE
        aircraftID = p_aircraftID;
END // 


CREATE PROCEDURE insert_flight(
    IN p_aircraftID VARCHAR(8),
    IN p_model VARCHAR(50),
    IN p_business INT,
    IN p_economy INT,
    IN p_updatedBy VARCHAR(50),
    IN p_uTime TIMESTAMP
)
BEGIN
    INSERT INTO flights (aircraftID, model, business, economy, updatedBy, uTime)
    VALUES (p_aircraftID, p_model, p_business, p_economy, p_updatedBy, p_uTime);
END //


CREATE PROCEDURE delete_flight(
    IN p_aircraftID VARCHAR(8),
    IN p_updatedBy VARCHAR(50)
)
BEGIN
    DELETE FROM flights WHERE aircraftID = p_aircraftID;
    UPDATE flights_deleted
    SET updatedBy = p_updatedBy, uTime = CURRENT_TIMESTAMP
    WHERE aircraftID = p_aircraftID;
END //


CREATE PROCEDURE update_route(
    IN p_id VARCHAR(8),
    IN p_departureAirportCode VARCHAR(3),
    IN p_arrivalAirportCode VARCHAR(3),
    IN p_basePrice DECIMAL(10, 2),
    IN p_aircraftID VARCHAR(4),
    IN p_departureTime TIME,
    IN p_arrivalTime TIME,
    IN p_Mon BOOLEAN,
    IN p_Tue BOOLEAN,
    IN p_Wed BOOLEAN,
    IN p_Thu BOOLEAN,
    IN p_Fri BOOLEAN,
    IN p_Sat BOOLEAN,
    IN p_Sun BOOLEAN,
    IN p_updatedBy VARCHAR(50),
    IN p_uTime TIMESTAMP
)
BEGIN
    UPDATE routes
    SET departureAirportCode = p_departureAirportCode, arrivalAirportCode = p_arrivalAirportCode, basePrice = p_basePrice,
        aircraftID = p_aircraftID, departureTime = p_departureTime, arrivalTime = p_arrivalTime,
        Mon = p_Mon, Tue = p_Tue, Wed = p_Wed, Thu = p_Thu, Fri = p_Fri, Sat = p_Sat, Sun = p_Sun, updatedBy = p_updatedBy, uTime = p_uTime
    WHERE id = p_id;
END //


CREATE PROCEDURE insert_route(
    IN p_id VARCHAR(8),
    IN p_departureAirportCode VARCHAR(3),
    IN p_arrivalAirportCode VARCHAR(3),
    IN p_basePrice DECIMAL(10, 2),
    IN p_aircraftID VARCHAR(4),
    IN p_departureTime TIME,
    IN p_arrivalTime TIME,
    IN p_Mon BOOLEAN,
    IN p_Tue BOOLEAN,
    IN p_Wed BOOLEAN,
    IN p_Thu BOOLEAN,
    IN p_Fri BOOLEAN,
    IN p_Sat BOOLEAN,
    IN p_Sun BOOLEAN,
    IN p_updatedBy VARCHAR(50),
    IN p_uTime TIMESTAMP
)
BEGIN
    INSERT INTO routes (id, departureAirportCode, arrivalAirportCode, basePrice, aircraftID, departureTime, arrivalTime, Mon, Tue, Wed, Thu, Fri, Sat, Sun, updatedBy, uTime)
    VALUES (p_id, p_departureAirportCode, p_arrivalAirportCode, p_basePrice, p_aircraftID, p_departureTime, p_arrivalTime, p_Mon, p_Tue, p_Wed, p_Thu, p_Fri, p_Sat, p_Sun, p_updatedBy, p_uTime);
END //


CREATE PROCEDURE delete_route(
    IN p_id VARCHAR(8),
    IN p_updatedBy VARCHAR(50)
)
BEGIN
    DELETE FROM routes WHERE id = p_id;
    UPDATE routes_deleted
    SET updatedBy = p_updatedBy, uTime = CURRENT_TIMESTAMP
    WHERE id = p_id;
END //

DELIMITER //

CREATE PROCEDURE insert_city(
    IN p_cityID VARCHAR(3),
    IN p_cityName VARCHAR(100),
    IN p_airportName VARCHAR(100),
    IN p_updatedBy VARCHAR(50),
    IN p_uTime TIMESTAMP
)
BEGIN
    INSERT INTO cities (cityID, cityName, airportName, updatedBy, uTime)
    VALUES (p_cityID, p_cityName, p_airportName, p_updatedBy, p_uTime);
END //

CREATE PROCEDURE update_city(
    IN p_cityID VARCHAR(3),
    IN p_cityName VARCHAR(100),
    IN p_airportName VARCHAR(100),
    IN p_updatedBy VARCHAR(50),
    IN p_uTime TIMESTAMP
)
BEGIN
    UPDATE cities
    SET cityName = p_cityName, airportName = p_airportName, updatedBy = p_updatedBy, uTime = p_uTime
    WHERE cityID = p_cityID;
END //


CREATE PROCEDURE delete_city(
    IN p_cityID VARCHAR(3),
    IN p_updatedBy VARCHAR(50)
)
BEGIN
    DELETE FROM cities WHERE cityID = p_cityID;
    UPDATE cities_deleted
    SET updatedBy = p_updatedBy, uTime = CURRENT_TIMESTAMP
    WHERE cityID = p_cityID;
END //

DELIMITER ;

GRANT EXECUTE ON PROCEDURE flightBooking.airportDetails TO user;

GRANT EXECUTE ON FUNCTION flightBooking.seatAvailability TO user;