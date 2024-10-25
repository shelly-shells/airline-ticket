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

function ConnectingFlightResult({ resultPair, source, destination }) {
	return (
		<div className="connecting-flight-result">
			<h2>Flight 1</h2>
			<FlightResult
				result={resultPair[0]}
				source={source}
				destination={[resultPair[0][8], resultPair[0][7]]}
			/>
			<br />
			<br />
			<h2>Flight 2</h2>
			<FlightResult
				result={resultPair[1]}
				source={[resultPair[1][8], resultPair[1][7]]}
				destination={destination}
			/>
		</div>
	);
}

function SearchResults() {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [showConnectingFlights, setShowConnectingFlights] =
		React.useState(false);

	React.useEffect(() => {
		const searchData = JSON.parse(
			document.getElementById("search-data").textContent
		);
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

	if (loading) {
		return <div>Loading search results...</div>;
	}

	if (!data) {
		return <div>Error loading search results. Please try again later.</div>;
	}

	return (
		<div className="results-container">
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
				<div>
					<div>
						<h3>No "To Flights" found.</h3>
					</div>
					{!showConnectingFlights && (
						<button onClick={() => setShowConnectingFlights(true)}>
							Show Connecting Flights
						</button>
					)}
				</div>
			)}

			{data.returnFlights && data.returnFlights.length > 0 ? (
				<div>
					<h2>Return Flights</h2>
					{data.returnFlights.map((result, index) => (
						<div key={index} className="result">
							<FlightResult
								result={result}
								source={data.destination}
								destination={data.source}
							/>
						</div>
					))}
				</div>
			) : data.returnFlights === false ? (
				<div></div>
			) : (
				<div>
					<div>
						<h3>No "Return Flights" found.</h3>
					</div>
					{!showConnectingFlights && (
						<button onClick={() => setShowConnectingFlights(true)}>
							Show Connecting Flights
						</button>
					)}
				</div>
			)}

			{showConnectingFlights && (
				<div>
					{data.connectingOneWay &&
					data.connectingOneWay.length > 0 ? (
						<div>
							<h2>Connecting One-Way Flights</h2>
							{data.connectingOneWay.map((resultPair, index) => (
								<div key={index} className="result">
									<ConnectingFlightResult
										resultPair={resultPair}
										source={data.source}
										destination={data.destination}
									/>
								</div>
							))}
						</div>
					) : (
						<div>
							<h3>No connecting one-way flights found.</h3>
						</div>
					)}

					{data.connectingRoundTrip &&
					data.connectingRoundTrip.length > 0 ? (
						<div>
							<h2>Connecting Round-Trip Flights</h2>
							{data.connectingRoundTrip.map(
								(resultPair, index) => (
									<div key={index} className="result">
										<ConnectingFlightResult
											resultPair={resultPair}
											source={data.destination}
											destination={data.source}
										/>
									</div>
								)
							)}
						</div>
					) : (
						<div>
							<h3>No connecting round-trip flights found.</h3>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

ReactDOM.render(<SearchResults />, document.getElementById("root"));
