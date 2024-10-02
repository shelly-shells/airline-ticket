function Home() {
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
		let returnDate = document.querySelector(
			'input[placeholder="Return Date"]'
		).value;
		let tripType = document.querySelector("select").value;
		let adults = document.querySelector(
			'input[placeholder="Number of Adults"]'
		).value;
		let children = document.querySelector(
			'input[placeholder="Number of Children"]'
		).value;
		let data = {
			origin,
			destination,
			departure,
			returnDate,
			tripType,
			adults,
			children,
		};
		fetch("/search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then((response) => {
			if (response.redirected) {
				window.location.href = response.url;
			}
		});
	}
	return (
		<div>
			<TopBar />
			<div className="booking-container">
				<h1>Book Your Flight</h1>
				<input type="text" placeholder="Origin" />
				<input type="text" placeholder="Destination" />
				<input type="date" placeholder="Departure Date" />
				<input type="date" placeholder="Return Date" />
				<select>
					<option value="one-way">One Way</option>
					<option value="round-trip">Round Trip</option>
				</select>
				<input type="number" placeholder="Number of Adults" min="1" />
				<input type="number" placeholder="Number of Children" min="0" />
				<button onClick={search}>Search Flights</button>
			</div>
		</div>
	);
}

ReactDOM.render(<Home />, document.getElementById("root"));
