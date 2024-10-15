class CitiesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            isEditing: false,
            editedCity: null,
        };
    }

    componentDidMount() {
        fetch("/api/cities")
            .then((response) => response.json())
            .then((data) => this.setState({ cities: data }));
    }

    handleEditClick = (city) => {
        this.setState({ isEditing: true, editedCity: { ...city } });
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            editedCity: { ...prevState.editedCity, [name]: value },
        }));
    };

    handleSaveClick = () => {
        const { editedCity } = this.state;
        fetch(`/api/cities/${editedCity.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editedCity),
        }).then(() => {
            this.setState((prevState) => ({
                cities: prevState.cities.map((city) =>
                    city.id === editedCity.id ? editedCity : city
                ),
                isEditing: false,
                editedCity: null,
            }));
        });
    };

    render() {
        const { cities, isEditing, editedCity } = this.state;

        return (
            <div>
                <h1>Cities</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
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
                                    {isEditing && editedCity.cityID === city.cityID ? (
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
                                    {isEditing && editedCity.cityID === city.cityID ? (
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
                                    {isEditing && editedCity.cityID === city.cityID ? (
                                        <button onClick={this.handleSaveClick}>
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                this.handleEditClick(city)
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

ReactDOM.render(<CitiesTable />, document.getElementById("root"));
