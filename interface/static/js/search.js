function FlightResult({ result, source, destination, onSelectFlight }) {
	return (
		<div className="flight-result" onClick={() => onSelectFlight(result)}>
			<div className="time-row">
				<p><span>Departure:</span> {result[1]}</p>
				<p><span>Arrival:</span> {result[2]}</p>
			</div>
			<div className="airport-row">
				<p>{source[0]}<br />{source[1]}</p>
				<p>{destination[0]}<br />{destination[1]}</p>
			</div>
			<p><span>Flight:</span> {result[0]}</p>
			<p><span>Price:</span> {result[3]}</p>
			<p><span>Aircraft Model:</span> {result[4]}</p>
		</div>
	);
}

function SearchResults() {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const searchData = JSON.parse(document.getElementById("search-data").textContent);
		const params = new URLSearchParams(searchData).toString();

		fetch(`/api/search-flights?${params}`)
			.then((response) => response.json())
			.then((data) => {
				console.log("Search results:", data);
				setData(data.results);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Failed to fetch search results:", error);
				setLoading(false);
			});
	}, []);

	const redirectToBookingConfirmation = (selectedFlightData) => {
		// Get number of adults and children from home.js (stored in sessionStorage)
		const numAdults = sessionStorage.getItem("numAdults") || 1;
		const numChildren = sessionStorage.getItem("numChildren") || 0;

		// Store flight data and passenger count in sessionStorage
		sessionStorage.setItem("flightData", JSON.stringify(selectedFlightData));
		sessionStorage.setItem("adults", numAdults);
		sessionStorage.setItem("children", numChildren);

		// Redirect to booking confirmation page
		window.location.href = "/booking-confirmation";
	};

	if (loading) return <div>Loading search results...</div>;

	if (!data) return <div>Error loading search results. Please try again later.</div>;

	return (
		<div className="results-container">
			{data.toFlights && data.toFlights.length > 0 && (
				<div>
					<h2>To Flights</h2>
					{data.toFlights.map((result, index) => (
						<div key={index} className="result">
							<FlightResult
								result={result}
								source={data.source}
								destination={data.destination}
								onSelectFlight={redirectToBookingConfirmation}
							/>
						</div>
					))}
				</div>
			)}

			{/* Render connecting flights and return flights similarly if needed */}
		</div>
	);
}

ReactDOM.render(<SearchResults />, document.getElementById("root"));
