function Home() {
    const [tripType, setTripType] = React.useState("False");

    function handleTripTypeChange(event) {
        setTripType(event.target.value);
    }

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
        let returnDate =
            tripType === "True"
                ? document.querySelector('input[placeholder="Return Date"]')
                      .value
                : null;
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
            if (response.ok) {
                window.location.href = "/search";
            }
        });
    }

    return (
        <div>
            <TopBar />
            <div className="booking-container">
                <h1>Book Your Flight</h1>
                <input type="text" placeholder="Origin" defaultValue="DEL" />
                <input
                    type="text"
                    placeholder="Destination"
                    defaultValue="BOM"
                />
                <input
                    type="date"
                    placeholder="Departure Date"
                    defaultValue="2023-01-01"
                />
                {tripType === "True" && (
                    <input
                        type="date"
                        placeholder="Return Date"
                        defaultValue="2023-01-15"
                    />
                )}
                <select value={tripType} onChange={handleTripTypeChange}>
                    <option value="False">One Way</option>
                    <option value="True">Round Trip</option>
                </select>
                <input
                    type="number"
                    placeholder="Number of Adults"
                    min="1"
                    defaultValue="1"
                />
                <input
                    type="number"
                    placeholder="Number of Children"
                    min="0"
                    defaultValue="0"
                />
                <button onClick={search}>Search Flights</button>
            </div>
        </div>
    );
}

ReactDOM.render(<Home />, document.getElementById("root"));
