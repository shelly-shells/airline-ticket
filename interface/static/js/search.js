function FlightResult({ result }) {
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
                <p>{result[7]}</p>
                <p>{result[8]}</p>
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

function SearchResults() {
    const searchDataElement = document.getElementById("search-data");
    let data = {};

    try {
        data = JSON.parse(searchDataElement.textContent);
    } catch (error) {
        console.error("Failed to parse search data:", error);
        return <div>Error loading search results. Please try again later.</div>;
    }

    return (
        <div className="results-container">
            {data.toFlights && data.toFlights.length > 0 ? (
                <div>
                    <h2>To Flights</h2>
                    {data.toFlights.map((result, index) => (
                        <div key={index} className="result">
                            <FlightResult result={result} />
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
                            <FlightResult result={result} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>No "Return Flights" found.</div>
            )}
        </div>
    );
}

ReactDOM.render(<SearchResults />, document.getElementById("root"));
