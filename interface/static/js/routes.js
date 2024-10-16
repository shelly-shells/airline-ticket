class RoutesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            isAdding: false,
            isEditing: false,
            editedRoute: null,
            newRoute: {
                id: "",
                aircraftID: "",
                departureAirportCode: "",
                arrivalAirportCode: "",
                departureTime: "",
                arrivalTime: "",
                basePrice: "",
                Mon: "",
                Tue: "",
                Wed: "",
                Thu: "",
                Fri: "",
                Sat: "",
                Sun: "",
            },
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
        this.setState({
            isEditing: true,
            editedRoute: { ...route },
            isAdding: false,
        });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            editedRoute: prevState.editedRoute
                ? { ...prevState.editedRoute, [name]: value }
                : { ...prevState.newRoute, [name]: value },
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

    handleAddNewRoute = () => {
        const { newRoute } = this.state;
        fetch(`/api/routes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRoute),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.id) {
                    this.setState((prevState) => ({
                        routes: [...prevState.routes, data],
                        isAdding: false,
                        newRoute: {
                            id: "",
                            aircraftID: "",
                            departureAirportCode: "",
                            arrivalAirportCode: "",
                            departureTime: "",
                            arrivalTime: "",
                            basePrice: "",
                            Mon: "",
                            Tue: "",
                            Wed: "",
                            Thu: "",
                            Fri: "",
                            Sat: "",
                            Sun: "",
                        },
                    }));
                }
            })
            .catch((error) => {
                console.error("Error adding new route:", error);
            });
    };

    handleAddRowClick = () => {
        this.setState({
            isAdding: true,
            isEditing: false,
            editedRoute: null,
        });
    };

    handleCancelAddEdit = () => {
        this.setState({
            isAdding: false,
            isEditing: false,
            editedRoute: null,
            newRoute: {
                id: "",
                aircraftID: "",
                departureAirportCode: "",
                arrivalAirportCode: "",
                departureTime: "",
                arrivalTime: "",
                basePrice: "",
                Mon: "",
                Tue: "",
                Wed: "",
                Thu: "",
                Fri: "",
                Sat: "",
                Sun: "",
            },
        });
    };

    handleDeleteClick = (id) => {
        fetch(`/api/routes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            this.setState((prevState) => ({
                routes: prevState.routes.filter((route) => route.id !== id),
            }));
        });
    };

    render() {
        const { routes, isAdding, isEditing, editedRoute, newRoute } =
            this.state;
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
                                                value={editedRoute[day]}
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
                                                    this.handleEditClick(route)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    this.handleDeleteClick(
                                                        route.id
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
                        {/* Render New Route Input Row Only When Adding */}
                        {isAdding && (
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        name="id"
                                        value={newRoute.id}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newRoute: {
                                                    ...prevState.newRoute,
                                                    id: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="aircraftID"
                                        value={newRoute.aircraftID}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newRoute: {
                                                    ...prevState.newRoute,
                                                    aircraftID: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="departureAirportCode"
                                        value={newRoute.departureAirportCode}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newRoute: {
                                                    ...prevState.newRoute,
                                                    departureAirportCode:
                                                        e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="arrivalAirportCode"
                                        value={newRoute.arrivalAirportCode}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newRoute: {
                                                    ...prevState.newRoute,
                                                    arrivalAirportCode:
                                                        e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="departureTime"
                                        value={newRoute.departureTime}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newRoute: {
                                                    ...prevState.newRoute,
                                                    departureTime:
                                                        e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="arrivalTime"
                                        value={newRoute.arrivalTime}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newRoute: {
                                                    ...prevState.newRoute,
                                                    arrivalTime: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="basePrice"
                                        value={newRoute.basePrice}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newRoute: {
                                                    ...prevState.newRoute,
                                                    basePrice: e.target.value,
                                                },
                                            }))
                                        }
                                    />
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
                                        <input
                                            type="text"
                                            name={day}
                                            value={newRoute[day]}
                                            onChange={(e) =>
                                                this.setState((prevState) => ({
                                                    newRoute: {
                                                        ...prevState.newRoute,
                                                        [day]: e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                    </td>
                                ))}
                                <td>
                                    <button onClick={this.handleAddNewRoute}>
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

ReactDOM.render(<RoutesTable />, document.getElementById("root"));
