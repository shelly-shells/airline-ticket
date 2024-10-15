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
