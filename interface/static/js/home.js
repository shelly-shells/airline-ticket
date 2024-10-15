function FlightResult({ result, source, destination }) {
	return (
		<div className="flight-result">
			<div className="time-row">
				<p>
					<span>Departure:</span> {result[1]}
				</p>
				<p>
					<span>Arrival:</span> {result[2]}
				</p>
			</div>
			<div className="airport-row">
				<p>
					{source[0]}
					<br />
					{source[1]}
				</p>
				<p>
					{destination[0]}
					<br />
					{destination[1]}
				</p>
			</div>
			<p>
				<span>Flight:</span> {result[0]}
			</p>
			<p>
				<span>Price:</span> {result[3]}
			</p>
			<p>
				<span>Aircraft Model:</span> {result[4]}
			</p>
		</div>
	);
}

function Home() {
	const [tripType, setTripType] = React.useState("False");
	const [data, setData] = React.useState(null);
	const [error, setError] = React.useState(null);

	function handleTripTypeChange(event) {
		setTripType(event.target.value);
	}

	function search() {
		let origin = document.querySelector(
			'input[placeholder="Origin"]'
		).value;
		let destination = document.querySelector(
			'input[placeholder="Destination"]'
		).value;
		let departure = document.querySelector(
			'input[placeholder="Departure Date"]'
		).value;
		let returnDate =
			tripType === "True"
				? document.querySelector('input[placeholder="Return Date"]')
						.value
				: null;
		let adults = document.querySelector(
			'input[placeholder="Number of Adults"]'
		).value;
		let children = document.querySelector(
			'input[placeholder="Number of Children"]'
		).value;

		let params = new URLSearchParams({
			origin,
			destination,
			departure,
			returnDate,
			tripType,
			adults,
			children,
		});

		fetch(`/search?${params.toString()}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.status === "success") {
					setData(data.results);
				} else {
					setError(data.message);
				}
			})
			.catch((error) => {
				setError("Failed to fetch search results.");
				console.error("Error fetching search results:", error);
			});
	}

	return (
		<div>
			<TopBar />
			<div className="booking-container">
				<h1>Book Your Flight</h1>
				<input type="text" placeholder="Origin" defaultValue="DEL" />
				<input
					type="text"
					placeholder="Destination"
					defaultValue="BOM"
				/>
				<input
					type="date"
					placeholder="Departure Date"
					defaultValue="2023-01-01"
				/>
				{tripType === "True" && (
					<input
						type="date"
						placeholder="Return Date"
						defaultValue="2023-01-15"
					/>
				)}
				<select value={tripType} onChange={handleTripTypeChange}>
					<option value="False">One Way</option>
					<option value="True">Round Trip</option>
				</select>
				<input
					type="number"
					placeholder="Number of Adults"
					min="1"
					defaultValue="1"
				/>
				<input
					type="number"
					placeholder="Number of Children"
					min="0"
					defaultValue="0"
				/>
				<button onClick={search}>Search Flights</button>
			</div>
			<div className="results-container">
				{error && <div>Error loading search results: {error}</div>}
				{!error && !data && <div>Loading...</div>}
				{data && (
					<div>
						{data.toFlights && data.toFlights.length > 0 ? (
							<div>
								<h2>To Flights</h2>
								{data.toFlights.map((result, index) => (
									<div key={index} className="result">
										<FlightResult
											result={result}
											source={data.source}
											destination={data.destination}
										/>
									</div>
								))}
							</div>
						) : (
							<div>No "To Flights" found.</div>
						)}

						{data.returnFlights && data.returnFlights.length > 0 ? (
							<div>
								<h2>Return Flights</h2>
								{data.returnFlights.map((result, index) => (
									<div key={index} className="result">
										<FlightResult
											result={result}
											source={data.source}
											destination={data.destination}
										/>
									</div>
								))}
							</div>
						) : (
							<div>No "Return Flights" found.</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

ReactDOM.render(<Home />, document.getElementById("root"));
