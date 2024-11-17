function TopBar() {
	const [showDropdown, setShowDropdown] = React.useState(false);

	function toggleDropdown() {
		setShowDropdown(!showDropdown);
	}

	return (
		<div className="top-bar">
			<div className="logo">
				<img src="static/bookingo.png" alt="Brand Logo" height="30" />
			</div>

			<div className="nav-buttons">
				<button
					className="my-bookings"
					onClick={() => (window.location.href = "/myBookings")}
				>
					My Bookings
				</button>
				<button className="home">Home</button>
				<div className="user-profile">
					<button onClick={toggleDropdown} className="profile-button">
						User Profile
					</button>
					{showDropdown && (
						<div className="dropdown">
							<button
								onClick={() =>
									(window.location.href = "/profile")
								}
							>
								Profile
							</button>
							<button
								onClick={() =>
									(window.location.href = "/logout")
								}
							>
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function Home() {
	const today = new Date().toISOString().split("T")[0];
	const oneYearFromToday = new Date();
	oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);
	const maxDate = oneYearFromToday.toISOString().split("T")[0];

	const [tripType, setTripType] = React.useState(false);
	const [origin, setOrigin] = React.useState("");
	const [destination, setDestination] = React.useState("");
	const [departure, setDeparture] = React.useState(today);
	const [returnDate, setReturnDate] = React.useState("");
	const [adults, setAdults] = React.useState(1);
	const [children, setChildren] = React.useState(0);
	const [seatClass, setSeatClass] = React.useState("Economy");
	const [cities, setCities] = React.useState([]);

	React.useEffect(() => {
		async function fetchCities() {
			try {
				const response = await fetch("/api/get-cities");
				if (response.ok) {
					const data = await response.json();
					const sortedCities = data.cities.sort((a, b) =>
						a.cityName.localeCompare(b.cityName)
					);
					setCities(sortedCities);
				} else {
					console.error("Failed to fetch cities");
					setCities([]);
				}
			} catch (error) {
				console.error("Error fetching cities:", error);
				setCities([]);
			}
		}

		fetchCities();
	}, []);

	function handleTripTypeChange(event) {
		setTripType(event.target.value === "True");
	}

	function handleDepartureChange(event) {
		setDeparture(event.target.value);
	}

	function handleReturnDateChange(event) {
		setReturnDate(event.target.value);
	}

	function search() {
		if (!origin) {
			alert("Please select an origin airport.");
			return;
		}
		if (!destination) {
			alert("Please select a destination airport.");
			return;
		}

		if (origin === destination) {
			alert("Origin and destination cannot be the same.");
			return;
		}
		
		if (departure < today) {
			alert("Departure date cannot be in the past.");
			return;
		}
		if (departure > maxDate) {
			alert("Departure date cannot be more than one year in advance.");
			return;
		}
		if (tripType && returnDate < departure) {
			alert("Return date cannot be before the departure date.");
			return;
		}
		if (tripType && returnDate > maxDate) {
			alert("Return date cannot be more than one year in advance.");
			return;
		}
		if (adults + children === 0) {
			alert(
				"The total number of passengers (adults + children) must be at least 1."
			);
			return;
		}

		if (adults + children > 9) {
			alert("The maximum number of passengers is 9.");
			return;
		}

		const params = new URLSearchParams({
			origin,
			destination,
			departure,
			returnDate: tripType ? returnDate : "",
			tripType: tripType.toString(),
			adults,
			children,
			seatClass,
		});

		window.location.href = `/search?${params.toString()}`;
	}

	return (
		<div>
			<TopBar />
			<div className="booking-container">
				<h1>Book Your Flight</h1>
				<div className="input-row">
					<div className="input-group">
						<label htmlFor="origin">Origin:</label>
						<select
							id="origin"
							value={origin}
							onChange={(e) => setOrigin(e.target.value)}
						>
							<option value="" disabled>
								Select Origin
							</option>
							{cities.map((city) => (
								<option key={city.cityID} value={city.cityID}>
									{city.cityName}
								</option>
							))}
						</select>
					</div>
					<div className="input-group">
						<label htmlFor="destination">Destination:</label>
						<select
							id="destination"
							value={destination}
							onChange={(e) => setDestination(e.target.value)}
						>
							<option value="" disabled>
								Select Destination
							</option>
							{cities.map((city) => (
								<option key={city.cityID} value={city.cityID}>
									{city.cityName}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="input-row">
					<div className="input-group centered">
						<label htmlFor="tripType">Trip Type:</label>
						<select
							id="tripType"
							value={tripType ? "True" : "False"}
							onChange={handleTripTypeChange}
						>
							<option value="False">One Way</option>
							<option value="True">Round Trip</option>
						</select>
					</div>
				</div>
				<div className="input-row">
					<div
						className={`input-group ${!tripType ? "centered" : ""}`}
						style={{ width: tripType ? "48%" : "100%" }}
					>
						<label htmlFor="departure">Departure Date:</label>
						<input
							id="departure"
							type="date"
							value={departure}
							onChange={handleDepartureChange}
							min={today}
							max={maxDate}
						/>
					</div>
					{tripType && (
						<div className="input-group">
							<label htmlFor="returnDate">Return Date:</label>
							<input
								id="returnDate"
								type="date"
								value={returnDate}
								onChange={handleReturnDateChange}
								min={departure}
								max={maxDate}
							/>
						</div>
					)}
				</div>
				<div className="input-row">
					<div className="input-group centered">
						<label htmlFor="seatClass">Seat Class:</label>
						<select
							id="seatClass"
							value={seatClass}
							onChange={(e) => setSeatClass(e.target.value)}
						>
							<option value="Economy">Economy</option>
							<option value="Business">Business</option>
						</select>
					</div>
				</div>
				<div className="input-row">
					<div className="input-group">
						<label htmlFor="adults">Number of Adults:</label>
						<input
							id="adults"
							type="number"
							min="0"
							step="1"
							value={adults}
							onChange={(e) =>
								setAdults(Math.floor(e.target.value))
							}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="children">Number of Children:</label>
						<input
							id="children"
							type="number"
							min="0"
							step="1"
							value={children}
							onChange={(e) =>
								setChildren(Math.floor(e.target.value))
							}
						/>
					</div>
				</div>
				<button onClick={search}>Search Flights</button>
			</div>
		</div>
	);
}

ReactDOM.render(<Home />, document.getElementById("root"));
