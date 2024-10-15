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
                            <th>Departure</th>
                            <th>Arrival</th>
                            <th>Base Price</th>
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
                                            name="departure"
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
                                            name="arrival"
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
                                            name="basePrice"
                                            value={editedRoute.basePrice}
                                            onChange={this.handleInputChange}
                                        />
                                    ) : (
                                        route.basePrice
                                    )}
                                </td>
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
