function TopBar() {
    const [showDropdown, setShowDropdown] = React.useState(false);

    function toggleDropdown() {
        setShowDropdown(!showDropdown);
    }

    return (
        <div className="top-bar">
            <div className="logo">
                <img src="static/bookingo.png" alt="Brand Logo" height="30" />
            </div>

            <div className="nav-buttons">
                <button className="my-bookings">My Bookings</button>
                <button className="home">Home</button>
                <div className="user-profile">
                    <button onClick={toggleDropdown} className="profile-button">User Profile</button>
                    {showDropdown && (
                        <div className="dropdown">
                            <button onClick={() => window.location.href = "/profile"}>Profile</button>
                            <button onClick={() => window.location.href = "/logout"}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Home() {
    const [tripType, setTripType] = React.useState(false);
    const [origin, setOrigin] = React.useState("");
    const [destination, setDestination] = React.useState("");
    const [departure, setDeparture] = React.useState("2024-11-01");
    const [returnDate, setReturnDate] = React.useState("2024-11-15");
    const [adults, setAdults] = React.useState(1);
    const [children, setChildren] = React.useState(0);
    const [seatClass, setSeatClass] = React.useState("Economy");
    const [cities, setCities] = React.useState([]);

    const today = new Date().toISOString().split("T")[0];

    React.useEffect(() => {
        async function fetchCities() {
            try {
                const response = await fetch("/api/get-cities");
                if (response.ok) {
                    const data = await response.json();
                    setCities(data.cities);
                } else {
                    console.error("Failed to fetch cities");
                    setCities([]);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
                setCities([]);
            }
        }

        fetchCities();
    }, []);

    function handleTripTypeChange(event) {
        setTripType(event.target.value === "True");
    }

    function search() {
        const params = new URLSearchParams({
            origin,
            destination,
            departure,
            returnDate: tripType ? returnDate : "",
            tripType: tripType.toString(),
            adults,
            children,
            seatClass,
        });

        window.location.href = `/search?${params.toString()}`;
    }

    return (
        <div>
            <TopBar />
            <div className="booking-container">
                <h1>Book Your Flight</h1>
                <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                >
                    <option value="" disabled>
                        Select Origin
                    </option>
                    {cities.map((city) => (
                        <option key={city.cityID} value={city.cityID}>
                            {city.cityName}
                        </option>
                    ))}
                </select>
                <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                >
                    <option value="" disabled>
                        Select Destination
                    </option>
                    {cities.map((city) => (
                        <option key={city.cityID} value={city.cityID}>
                            {city.cityName}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    placeholder="Departure Date"
                    value={departure}
                    onChange={(e) => {console.log(e.target.value.toString()); setDeparture(e.target.value.toString())}}
                    min={today}
                />
                {tripType && (
                    <input
                        type="date"
                        placeholder="Return Date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departure}
                    />
                )}
                <select
                    value={tripType ? "True" : "False"}
                    onChange={handleTripTypeChange}
                >
                    <option value="False">One Way</option>
                    <option value="True">Round Trip</option>
                </select>
                <input
                    type="number"
                    placeholder="Number of Adults"
                    min="1"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Number of Children"
                    min="0"
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                />
                <select
                    value={seatClass}
                    onChange={(e) => setSeatClass(e.target.value)}
                >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                </select>
                <button onClick={search}>Search Flights</button>
            </div>
        </div>
    );
}

ReactDOM.render(<Home />, document.getElementById("root"));
