function Home() {
	const [tripType, setTripType] = React.useState(false);
	const [origin, setOrigin] = React.useState("DEL");
	const [destination, setDestination] = React.useState("BOM");
	const [departure, setDeparture] = React.useState("2023-01-01");
	const [returnDate, setReturnDate] = React.useState("2023-01-15");
	const [adults, setAdults] = React.useState(1);
	const [children, setChildren] = React.useState(0);

	function handleTripTypeChange(event) {
		setTripType(event.target.value === "True");
	}

	function search() {
		const params = new URLSearchParams({
			origin,
			destination,
			departure,
			returnDate: tripType ? returnDate : "", // Include return date only for round trips
			tripType: tripType.toString(),
			adults,
			children,
		});

		window.location.href = `/search?${params.toString()}`;
	}

	return (
		<div>
			<TopBar />
			<div className="booking-container">
				<h1>Book Your Flight</h1>
				<input
					type="text"
					placeholder="Origin"
					value={origin}
					onChange={(e) => setOrigin(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Destination"
					value={destination}
					onChange={(e) => setDestination(e.target.value)}
				/>
				<input
					type="date"
					placeholder="Departure Date"
					value={departure}
					onChange={(e) => setDeparture(e.target.value)}
				/>
				{tripType && (
					<input
						type="date"
						placeholder="Return Date"
						value={returnDate}
						onChange={(e) => setReturnDate(e.target.value)}
					/>
				)}
				<select
					value={tripType ? "True" : "False"}
					onChange={handleTripTypeChange}
				>
					<option value="False">One Way</option>
					<option value="True">Round Trip</option>
				</select>
				<input
					type="number"
					placeholder="Number of Adults"
					min="1"
					value={adults}
					onChange={(e) => setAdults(e.target.value)}
				/>
				<input
					type="number"
					placeholder="Number of Children"
					min="0"
					value={children}
					onChange={(e) => setChildren(e.target.value)}
				/>
				<button onClick={search}>Search Flights</button>
			</div>
		</div>
	);
}

ReactDOM.render(<Home />, document.getElementById("root"));