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


function UserProfile() {
	const [user, setUser] = React.useState(null);
	const [errorMessage, setErrorMessage] = React.useState("");

	React.useEffect(() => {
		fetch("/api/profile", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.status === "success") {
					setUser(data.user);
				} else {
					setErrorMessage(data.message || "Failed to load user profile.");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setErrorMessage("An error occurred. Please try again later.");
			});
	}, []);

	if (errorMessage) {
		return <div className="error-message">{errorMessage}</div>;
	}

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="profile-container">
			<h1>User Profile</h1>
			<p><strong>Username:</strong> {user.username}</p>
			<p><strong>First Name:</strong> {user.firstName}</p>
			<p><strong>Last Name:</strong> {user.lastName}</p>
			<p><strong>Mobile:</strong> {user.mobileNo}</p>
			<p><strong>Email:</strong> {user.email}</p>
			<p><strong>Age:</strong> {user.age}</p>
			<p><strong>Gender:</strong> {user.gender}</p>
		</div>
	);
}

ReactDOM.render(<UserProfile />, document.getElementById("root"));
