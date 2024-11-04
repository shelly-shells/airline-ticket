function BookingConfirmation() {
	const storedFlightData = JSON.parse(localStorage.getItem("selectedFlight") || "{}");
    
    // Set default values if data is missing
    const [adults, setAdults] = React.useState(storedFlightData.adults || 1);
    const [children, setChildren] = React.useState(storedFlightData.children || 0);
    const [basePrice, setBasePrice] = React.useState(storedFlightData.price || 0);
    const [extraLuggage, setExtraLuggage] = React.useState(false);
    const [food, setFood] = React.useState(false);

    const luggageCost = 30;
    const foodCost = 20;
	
	const [flight, setFlight] = React.useState(storedFlightData)

    const totalPrice = () => {
        let total = basePrice * (parseInt(adults) + parseInt(children));
        if (extraLuggage) total += luggageCost * (parseInt(adults) + parseInt(children));
        if (food) total += foodCost * (parseInt(adults) + parseInt(children));
        return total.toFixed(2);
    };

    function confirmBooking() {
        const bookingData = {
            flightID: flight.id,
            date: flight.date,
            adults: adults,
            children: children,
            seatClass: flight.seatClass,
            amountPaid: totalPrice(),
            food: food,
            extraLuggage: extraLuggage
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
                    window.location.href = "/profile";
                } else {
                    alert("Failed to confirm booking. Try again.");
                }
            })
            .catch((error) => console.error("Booking error:", error));
    }

    return (
        <div className="confirmation-container">
            <h1>Booking Confirmation</h1>
            <p>Flight ID: {flight.id}</p>
            <p>Date: {flight.date}</p>
            <p>Seat Class: {flight.seatClass}</p>
            <p>Price per Ticket: ${flight.price}</p>

            <h3>Number of Passengers</h3>
            <p>Adults: {adults}</p>
            <p>Children: {children}</p>

            <div className="extras">
                <label>
                    <input
                        type="checkbox"
                        checked={extraLuggage}
                        onChange={() => setExtraLuggage(!extraLuggage)}
                    />
                    Extra Luggage (+${luggageCost} per passenger)
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={food}
                        onChange={() => setFood(!food)}
                    />
                    Food (+${foodCost} per passenger)
                </label>
            </div>

            <h2>Total Price: ${totalPrice()}</h2>
            <button onClick={confirmBooking} className="confirm-button">Confirm Booking</button>
        </div>
    );
}

ReactDOM.render(<BookingConfirmation />, document.getElementById("root"));
