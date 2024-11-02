// Retrieve data from sessionStorage
const flightData = JSON.parse(sessionStorage.getItem("flightData"));
const numAdults = parseInt(sessionStorage.getItem("adults"), 10);
const numChildren = parseInt(sessionStorage.getItem("children"), 10);

const adultPrice = flightData[3] * numAdults;
const childPrice = (flightData[3] * 0.75) * numChildren; // Assuming children pay 75% of the adult price
const totalPrice = adultPrice + childPrice;

function BookingConfirmation() {
	return (
		<div className="booking-confirmation">
			<h2>Booking Confirmation</h2>
			<div className="flight-details">
				<h3>Flight Details</h3>
				<p><strong>Flight:</strong> {flightData[0]}</p>
				<p><strong>Departure:</strong> {flightData[1]}</p>
				<p><strong>Arrival:</strong> {flightData[2]}</p>
				<p><strong>Aircraft Model:</strong> {flightData[4]}</p>
				<p><strong>Price per Adult:</strong> ${flightData[3]}</p>
			</div>

			<div className="billing-details">
				<h3>Billing Details</h3>
				<p><strong>Number of Adults:</strong> {numAdults} x ${flightData[3]} = ${adultPrice}</p>
				<p><strong>Number of Children:</strong> {numChildren} x ${flightData[3] * 0.75} = ${childPrice}</p>
				<p><strong>Total Price:</strong> ${totalPrice}</p>
			</div>
		</div>
	);
}

ReactDOM.render(<BookingConfirmation />, document.getElementById("root"));
