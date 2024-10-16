class CitiesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            isAdding: false,
            isEditing: false,
            editedCity: null,
            newCity: {
                cityID: "",
                cityName: "",
                airportName: "",
            },
        };
    }

    componentDidMount() {
        fetch("/api/cities")
            .then((response) => response.json())
            .then((data) => this.setState({ cities: data }));
    }

    handleEditClick = (city) => {
        this.setState({
            isEditing: true,
            editedCity: { ...city },
            isAdding: false,
        });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            editedCity: prevState.editedCity
                ? { ...prevState.editedCity, [name]: value }
                : { ...prevState.newCity, [name]: value },
        }));
    };

    handleSaveClick = () => {
        const { editedCity } = this.state;
        fetch(`/api/cities/${editedCity.cityID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedCity),
        }).then(() => {
            this.setState((prevState) => ({
                cities: prevState.cities.map((city) =>
                    city.cityID === editedCity.cityID ? editedCity : city
                ),
                isEditing: false,
                editedCity: null,
            }));
        });
    };

    handleAddNewCity = () => {
        const { newCity } = this.state;
        fetch(`/api/cities`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newCity),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.cityID) {
                    this.setState((prevState) => ({
                        cities: [...prevState.cities, data],
                        isAdding: false,
                        newCity: {
                            cityID: "",
                            cityName: "",
                            airportName: "",
                        },
                    }));
                }
            })
            .catch((error) => {
                console.error("Error adding new city:", error);
            });
    };

    handleAddRowClick = () => {
        this.setState({
            isAdding: true,
            isEditing: false,
            editedCity: null,
        });
    };

    handleCancelAddEdit = () => {
        this.setState({
            isAdding: false,
            isEditing: false,
            editedCity: null,
            newCity: {
                cityID: "",
                cityName: "",
                airportName: "",
            },
        });
    };

    handleDeleteClick = (cityID) => {
        fetch(`/api/cities/${cityID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            this.setState((prevState) => ({
                cities: prevState.cities.filter(
                    (city) => city.cityID !== cityID
                ),
            }));
        });
    };

    render() {
        const { cities, isAdding, isEditing, editedCity, newCity } = this.state;

        return (
            <div>
                <h1>Cities</h1>
                <table>
                    <thead>
                        <tr>
                            <th>cityID</th>
                            <th>City Name</th>
                            <th>Airport Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map((city) => (
                            <tr key={city.cityID}>
                                <td>{city.cityID}</td>
                                <td>
                                    {isEditing &&
                                    editedCity &&
                                    editedCity.cityID === city.cityID ? (
                                        <input
                                            type="text"
                                            name="cityName"
                                            value={editedCity.cityName}
                                            onChange={this.handleInputChange}
                                        />
                                    ) : (
                                        city.cityName
                                    )}
                                </td>
                                <td>
                                    {isEditing &&
                                    editedCity &&
                                    editedCity.cityID === city.cityID ? (
                                        <input
                                            type="text"
                                            name="airportName"
                                            value={editedCity.airportName}
                                            onChange={this.handleInputChange}
                                        />
                                    ) : (
                                        city.airportName
                                    )}
                                </td>
                                <td>
                                    {isEditing &&
                                    editedCity &&
                                    editedCity.cityID === city.cityID ? (
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
                                                    this.handleEditClick(city)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    this.handleDeleteClick(
                                                        city.cityID
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
                        {/* Render New City Input Row Only When Adding */}
                        {isAdding && (
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        name="cityID"
                                        value={newCity.cityID}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newCity: {
                                                    ...prevState.newCity,
                                                    cityID: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="cityName"
                                        value={newCity.cityName}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newCity: {
                                                    ...prevState.newCity,
                                                    cityName: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="airportName"
                                        value={newCity.airportName}
                                        onChange={(e) =>
                                            this.setState((prevState) => ({
                                                newCity: {
                                                    ...prevState.newCity,
                                                    airportName: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </td>
                                <td>
                                    <button onClick={this.handleAddNewCity}>
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

ReactDOM.render(<CitiesTable />, document.getElementById("root"));
