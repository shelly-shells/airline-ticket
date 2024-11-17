const isObjectEmpty = (objectName) => {
	return Object.keys(objectName).length === 0
}

function BookingConfirmation() {
	const storedFlightData = JSON.parse(
		localStorage.getItem("selectedFlights") || "{}"
	);

	const adults = (storedFlightData[0] ? storedFlightData[0].adults : 0) || 1;
	const children =(storedFlightData[0] ? storedFlightData[0].children : 0) || 1;
	const basePrice = storedFlightData[0] ? storedFlightData.reduce(
		(sum, flight) => sum + (parseFloat(flight.price) || 0),
		0
	) : 0;
	const [extraLuggage, setExtraLuggage] = React.useState(false);
	const [food, setFood] = React.useState(false);

	const luggageCost = 30;
	const foodCost = 20;

	const [flights, setFlights] = React.useState(storedFlightData);

	const [passengers, setPassengers] = React.useState([]);

	React.useEffect(() => {
		const totalPassengers = parseInt(adults) + parseInt(children);
		const initialPassengers = [];
		for (let i = 0; i < totalPassengers; i++) {
			initialPassengers.push({
				firstName: "",
				lastName: "",
				age: "",
				gender: "",
				type: i < adults ? "adult" : "child",
			});
		}
		setPassengers(initialPassengers);
	}, []);

	const totalPrice = () => {
		let total = basePrice * (parseInt(adults) + 0.75 * parseInt(children));
		if (extraLuggage)
			total += luggageCost * (parseInt(adults) + parseInt(children));
		if (food) total += foodCost * (parseInt(adults) + parseInt(children));
		return total.toFixed(2);
	};

	function handlePassengerChange(index, field, value) {
		setPassengers((prevPassengers) => {
			const newPassengers = [...prevPassengers];
			newPassengers[index] = { ...newPassengers[index], [field]: value };
			return newPassengers;
		});
	}

	function isFormValid() {
		return passengers.every((passenger) => {
			const age = parseInt(passenger.age);
			if (passenger.type === "child" && (age < 0 || age >= 18)) {
				alert("Child age must be between 0 and 18.");
				return false;
			}
			if (passenger.type === "adult" && (age < 18 || age > 99)) {
				alert("Adult age must be between 18 and 99.");
				return false;
			}
			return (
				passenger.firstName &&
				passenger.lastName &&
				passenger.age &&
				passenger.gender
			);
		});
	}

	async function confirmBooking() {
		if (!isFormValid()) {
			return;
		}

		let success = false;

		if (isObjectEmpty(flights))
		{
			alert("Die, scammer.");
			window.location.href = "/home";
		}

		const bookingPromises = flights.map(async (flight) => {
			const bookingData = {
				flightID: flight.id,
				date: flight.date,
				adults: flight.adults,
				children: flight.children,
				seatClass: flight.seatClass,
				amountPaid: totalPrice(),
				food: food,
				extraLuggage: extraLuggage,
				passengers: passengers,
			};
	
			try {
				const response = await fetch("/api/confirm-booking", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(bookingData),
				});
				const data = await response.json();
	
				if (data.status === "success") {
					console.log(`Booking confirmed for flight ID: ${flight.id}`);
					success = true;
				} else {
					alert(`Failed to confirm booking for flight ID: ${flight.id}`);
					success = false;
				}
			} catch (error) {
				console.error(`Booking error for flight ID: ${flight.id}`, error);
				success = false;
			}
		});

		await Promise.all(bookingPromises);

		if (success) {
			alert("All bookings confirmed!");
		} else {
			alert("Some or all bookings failed. Please try again later.");
		}
		localStorage.setItem("selectedFlights", "{}");
		window.location.href = "/home";
	}	

	return (
		<div className="confirmation-container">
			<h1>Booking Confirmation</h1>
			{!isObjectEmpty(flights) ? flights.map((flight, index) => (
				<div key={index} className="result">
					<p>
						<strong>Flight ID:</strong> {flight.id}
					</p>
					<p>
						<strong>Date:</strong> {flight.date}
					</p>
					<p>
						<strong>Seat Class:</strong> {flight.seatClass}
					</p>
					<p>
						<strong>Price per Ticket:</strong> Rs. {flight.price}
					</p>
					<hr />
				</div>
			)): ''}



			<h3>Number of Passengers</h3>
			<p>
				<strong>Adults:</strong> {adults}
			</p>
			<p>
				<strong>Children:</strong> {children}
			</p>

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
					<h4>
						Passenger {index + 1} ({passenger.type})
					</h4>
					<input
						type="text"
						placeholder="First Name"
						value={passenger.firstName}
						onChange={(e) =>
							handlePassengerChange(
								index,
								"firstName",
								e.target.value
							)
						}
					/>
					<input
						type="text"
						placeholder="Last Name"
						value={passenger.lastName}
						onChange={(e) =>
							handlePassengerChange(
								index,
								"lastName",
								e.target.value
							)
						}
					/>
					<input
						type="number"
						placeholder="Age"
						value={passenger.age}
						onChange={(e) =>
							handlePassengerChange(index, "age", e.target.value)
						}
					/>
					<select
						value={passenger.gender}
						onChange={(e) =>
							handlePassengerChange(
								index,
								"gender",
								e.target.value
							)
						}
					>
						<option value="">Select Gender</option>
						<option value="M">Male</option>
						<option value="F">Female</option>
						<option value="O">Other</option>
					</select>
				</div>
			))}

			<h2>Total Price: Rs. {totalPrice()}</h2>
			<button onClick={confirmBooking} className="confirm-button">
				Confirm Booking
			</button>
		</div>
	);
}

ReactDOM.render(<BookingConfirmation />, document.getElementById("root"));
