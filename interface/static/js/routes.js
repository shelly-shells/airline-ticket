class RoutesTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			routes: [],
			isEditing: false,
			editedRoute: null,
		};
	}

	componentDidMount() {
		fetch("/api/routes")
			.then((response) => response.json())
			.then((data) => {
				this.setState({ routes: data });
			});
	}

	handleEditClick = (route) => {
		this.setState({ isEditing: true, editedRoute: { ...route } });
	};

	handleInputChange = (event) => {
		const { name, value } = event.target;
		this.setState((prevState) => ({
			editedRoute: { ...prevState.editedRoute, [name]: value },
		}));
	};

	handleSaveClick = () => {
		const { editedRoute } = this.state;
		fetch(`/api/routes/${editedRoute.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(editedRoute),
		}).then(() => {
			this.setState((prevState) => ({
				routes: prevState.routes.map((route) =>
					route.id === editedRoute.id ? editedRoute : route
				),
				isEditing: false,
				editedRoute: null,
			}));
		});
	};

	render() {
		const { routes, isEditing, editedRoute } = this.state;
		return (
			<div>
				<h1>Routes</h1>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Aircraft ID</th>
							<th>Departure</th>
							<th>Arrival</th>
							<th>Departure Time</th>
							<th>Arrival Time</th>
							<th>Base Price</th>
							<th>Mon</th>
							<th>Tue</th>
							<th>Wed</th>
							<th>Thu</th>
							<th>Fri</th>
							<th>Sat</th>
							<th>Sun</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{routes.map((route) => (
							<tr key={route.id}>
								<td>{route.id}</td>
								<td>
									{isEditing &&
									editedRoute.id === route.id ? (
										<input
											type="text"
											name="aircraftID"
											value={editedRoute.aircraftID}
											onChange={this.handleInputChange}
										/>
									) : (
										route.aircraftID
									)}
								</td>
								<td>
									{isEditing &&
									editedRoute.id === route.id ? (
										<input
											type="text"
											name="departureAirportCode"
											value={
												editedRoute.departureAirportCode
											}
											onChange={this.handleInputChange}
										/>
									) : (
										route.departureAirportCode
									)}
								</td>
								<td>
									{isEditing &&
									editedRoute.id === route.id ? (
										<input
											type="text"
											name="arrivalAirportCode"
											value={
												editedRoute.arrivalAirportCode
											}
											onChange={this.handleInputChange}
										/>
									) : (
										route.arrivalAirportCode
									)}
								</td>
								<td>
									{isEditing &&
									editedRoute.id === route.id ? (
										<input
											type="text"
											name="departureTime"
											value={editedRoute.departureTime}
											onChange={this.handleInputChange}
										/>
									) : (
										route.departureTime
									)}
								</td>
								<td>
									{isEditing &&
									editedRoute.id === route.id ? (
										<input
											type="text"
											name="arrivalTime"
											value={editedRoute.arrivalTime}
											onChange={this.handleInputChange}
										/>
									) : (
										route.arrivalTime
									)}
								</td>
								<td>
									{isEditing &&
									editedRoute.id === route.id ? (
										<input
											type="text"
											name="basePrice"
											value={editedRoute.basePrice}
											onChange={this.handleInputChange}
										/>
									) : (
										route.basePrice
									)}
								</td>
								{[
									"Mon",
									"Tue",
									"Wed",
									"Thu",
									"Fri",
									"Sat",
									"Sun",
								].map((day) => (
									<td key={day}>
										{isEditing &&
										editedRoute.id === route.id ? (
											<input
												type="text"
												name={day} 
												value={editedRoute[day] } 
												onChange={
													this.handleInputChange
												}
											/>
										) : (
											route[day] 
										)}
									</td>
								))}

								<td>
									{isEditing &&
									editedRoute.id === route.id ? (
										<button onClick={this.handleSaveClick}>
											Save
										</button>
									) : (
										<button
											onClick={() =>
												this.handleEditClick(route)
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

ReactDOM.render(<RoutesTable />, document.getElementById("root"));