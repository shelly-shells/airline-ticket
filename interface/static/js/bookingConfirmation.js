function BookingConfirmation() {
    const storedFlightData = JSON.parse(localStorage.getItem("selectedFlight") || "{}");
    
    // Fixed values from stored flight data
    const adults = storedFlightData.adults || 1;
    const children = storedFlightData.children || 0;
    const basePrice = storedFlightData.price || 0;
    const [extraLuggage, setExtraLuggage] = React.useState(false);
    const [food, setFood] = React.useState(false);

    const luggageCost = 30;
    const foodCost = 20;
    
    const [flight, setFlight] = React.useState(storedFlightData);

    // State to store passenger details
    const [passengers, setPassengers] = React.useState([]);

    // Initialize passengers array based on fixed adult and children counts
    React.useEffect(() => {
        const totalPassengers = parseInt(adults) + parseInt(children);
        const initialPassengers = [];
        for (let i = 0; i < totalPassengers; i++) {
            initialPassengers.push({ firstName: '', lastName: '', age: '', gender: '' });
        }
        setPassengers(initialPassengers);
    }, []); // Empty dependency array to run only once on component mount

    const totalPrice = () => {
        let total = basePrice * (parseInt(adults) + 0.75 * parseInt(children));
        if (extraLuggage) total += luggageCost * (parseInt(adults) + parseInt(children));
        if (food) total += foodCost * (parseInt(adults) + parseInt(children));
        return total.toFixed(2);
    };

    // Handle changes in passenger details
    function handlePassengerChange(index, field, value) {
        setPassengers((prevPassengers) => {
            const newPassengers = [...prevPassengers];
            newPassengers[index] = { ...newPassengers[index], [field]: value };
            return newPassengers;
        });
    }

    // Check if all passenger details are filled
    function isFormValid() {
        return passengers.every(
            (passenger) =>
                passenger.firstName &&
                passenger.lastName &&
                passenger.age &&
                passenger.gender
        );
    }

    function confirmBooking() {
        const bookingData = {
            flightID: flight.id,
            date: flight.date,
            adults: adults,
            children: children,
            seatClass: flight.seatClass,
            amountPaid: totalPrice(),
            food: food,
            extraLuggage: extraLuggage,
            passengers: passengers,
        };

        fetch("/api/confirm-booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    alert("Booking confirmed!");
                    window.location.href = "/home";
                } else {
                    alert("Failed to confirm booking. Try again.");
                }
            })
            .catch((error) => console.error("Booking error:", error));
    }

    return (
        <div className="confirmation-container">
            <h1>Booking Confirmation</h1>
            <p><strong>Flight ID:</strong> {flight.id}</p>
            <p><strong>Date:</strong> {flight.date}</p>
            <p><strong>Seat Class:</strong> {flight.seatClass}</p>
            <p><strong>Price per Ticket:</strong> Rs. {flight.price}</p>

            <h3>Number of Passengers</h3>
            <p><strong>Adults:</strong> {adults}</p>
            <p><strong>Children:</strong> {children}</p>

            <div className="extras">
                <label>
                    <input
                        type="checkbox"
                        checked={extraLuggage}
                        onChange={() => setExtraLuggage(!extraLuggage)}
                    />
                    Extra Luggage (+ Rs. {luggageCost} per passenger)
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={food}
                        onChange={() => setFood(!food)}
                    />
                    Food (+ Rs. {foodCost} per passenger)
                </label>
            </div>

            <h3>Passenger Details</h3>
            {passengers.map((passenger, index) => (
                <div key={index} className="passenger-card">
                    <h4>Passenger {index + 1}</h4>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Age"
                        value={passenger.age}
                        onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    />
                    <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                </div>
            ))}

            <h2>Total Price: Rs. {totalPrice()}</h2>
            <button
                onClick={confirmBooking}
                className="confirm-button"
                disabled={!isFormValid()}
            >
                Confirm Booking
            </button>
        </div>
    );
}

ReactDOM.render(<BookingConfirmation />, document.getElementById("root"));
