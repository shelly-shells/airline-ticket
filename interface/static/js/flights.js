class FlightsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flights: [],
            isAdding: false,
            isEditing: false,
            editedFlight: null,
            newFlight: {
                aircraftID: "",
                model: "",
                business: "",
                economy: "",
            },
        };
    }

    componentDidMount() {
        fetch("/api/flights")
            .then((response) => response.json())
            .then((data) => this.setState({ flights: data }));
    }

    handleEditClick = (flight) => {
        this.setState({
            isEditing: true,
            editedFlight: { ...flight },
            isAdding: false,
        });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            editedFlight: prevState.editedFlight
                ? { ...prevState.editedFlight, [name]: value }
                : { ...prevState.newFlight, [name]: value },
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

    handleAddNewFlight = () => {
        const { newFlight } = this.state;
        fetch(`/api/flights`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFlight),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.aircraftID) {
                    this.setState((prevState) => ({
                        flights: [...prevState.flights, data],
                        isAdding: false,
                        newFlight: {
                            aircraftID: "",
                            model: "",
                            business: "",
                            economy: "",
                        },
                    }));
                }
            })
            .catch((error) => {
                console.error("Error adding new flight:", error);
            });
    };

    handleAddRowClick = () => {
        this.setState({
            isAdding: true,
            isEditing: false,
            editedFlight: null,
        });
    };

    handleCancelAddEdit = () => {
        this.setState({
            isAdding: false,
            isEditing: false,
            editedFlight: null,
            newFlight: {
                aircraftID: "",
                model: "",
                business: "",
                economy: "",
            },
        });
    };

    handleDeleteClick = (aircraftID) => {
        fetch(`/api/flights/${aircraftID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            this.setState((prevState) => ({
                flights: prevState.flights.filter(
                    (flight) => flight.aircraftID !== aircraftID
                ),
            }));
        });
    };

    render() {
        const { flights, isAdding, isEditing, editedFlight, newFlight } =
            this.state;
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
                                    editedFlight &&
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
                                    editedFlight &&
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
                                    editedFlight &&
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
                                    editedFlight &&
                                    editedFlight.aircraftID ===
                                        flight.aircraftID ? (
                                        <>
                                            <button
                                                onClick={this.handleSaveClick}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={
                                                    this.handleCancelAddEdit
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() =>
                                                    this.handleEditClick(flight)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    this.handleDeleteClick(
                                                        flight.aircraftID
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {/* Render New Flight Input Row Only When Adding */}
                        {isAdding && (
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        name="aircraftID"
                                        value={newFlight.aircraftID}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newFlight: {
                                                    ...prevState.newFlight,
                                                    aircraftID: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="model"
                                        value={newFlight.model}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newFlight: {
                                                    ...prevState.newFlight,
                                                    model: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="business"
                                        value={newFlight.business}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newFlight: {
                                                    ...prevState.newFlight,
                                                    business: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="economy"
                                        value={newFlight.economy}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newFlight: {
                                                    ...prevState.newFlight,
                                                    economy: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <button onClick={this.handleAddNewFlight}>
                                        Save
                                    </button>
                                    <button onClick={this.handleCancelAddEdit}>
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button onClick={this.handleAddRowClick}>Add Row</button>
            </div>
        );
    }
}

ReactDOM.render(<FlightsTable />, document.getElementById("root"));