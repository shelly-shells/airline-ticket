function SearchResults() {
	const searchDataElement = document.getElementById("search-data");
	const data = JSON.parse(searchDataElement.textContent);

	return (
		<div className="results-container">
			<h1>Search Results</h1>
			<p>Origin: {data.origin}</p>
			<p>Destination: {data.destination}</p>
			<p>Departure Date: {data.departure}</p>
			<p>Return Date: {data.return_date}</p>
			<p>Trip Type: {data.trip_type}</p>
			<p>Adults: {data.adults}</p>
			<p>Children: {data.children}</p>
		</div>
	);
}

ReactDOM.render(<SearchResults />, document.getElementById("root"));
