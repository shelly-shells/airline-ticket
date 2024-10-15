class FlightsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			flights: [],
			isEditing: false,
			editedFlight: null,
		};
	}

	componentDidMount() {
		fetch("/api/flights")
			.then((response) => response.json())
			.then((data) => this.setState({ flights: data }));
	}

	handleEditClick = (flight) => {
		this.setState({ isEditing: true, editedFlight: { ...flight } });
	};

	handleInputChange = (event) => {
		const { name, value } = event.target;
		this.setState((prevState) => ({
			editedFlight: { ...prevState.editedFlight, [name]: value },
		}));
	};

	handleSaveClick = () => {
		const { editedFlight } = this.state;
		fetch(`/api/flights/${editedFlight.aircraftID}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(editedFlight),
		}).then(() => {
			this.setState((prevState) => ({
				flights: prevState.flights.map((flight) =>
					flight.aircraftID === editedFlight.aircraftID
						? editedFlight
						: flight
				),
				isEditing: false,
				editedFlight: null,
			}));
		});
	};

	render() {
		const { flights, isEditing, editedFlight } = this.state;
		return (
			<div>
				<h1>Flights</h1>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Model</th>
							<th>Business</th>
							<th>Economy</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{flights.map((flight) => (
							<tr key={flight.aircraftID}>
								<td>{flight.aircraftID}</td>
								<td>
									{isEditing &&
									editedFlight.aircraftID ===
										flight.aircraftID ? (
										<input
											type="text"
											name="model"
											value={editedFlight.model}
											onChange={this.handleInputChange}
										/>
									) : (
										flight.model
									)}
								</td>
								<td>
									{isEditing &&
									editedFlight.aircraftID ===
										flight.aircraftID ? (
										<input
											type="text"
											name="business"
											value={editedFlight.business}
											onChange={this.handleInputChange}
										/>
									) : (
										flight.business
									)}
								</td>
								<td>
									{isEditing &&
									editedFlight.aircraftID ===
										flight.aircraftID ? (
										<input
											type="text"
											name="economy"
											value={editedFlight.economy}
											onChange={this.handleInputChange}
										/>
									) : (
										flight.economy
									)}
								</td>
								<td>
									{isEditing &&
									editedFlight.aircraftID ===
										flight.aircraftID ? (
										<button onClick={this.handleSaveClick}>
											Save
										</button>
									) : (
										<button
											onClick={() =>
												this.handleEditClick(flight)
											}
										>
											Edit
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}

ReactDOM.render(<FlightsTable />, document.getElementById("root"));
