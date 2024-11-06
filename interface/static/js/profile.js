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
	const [user, setUser] = React.useState(JSON.parse(document.getElementById("thissucks").dataset.user));
    const [errorMessage, setErrorMessage] = React.useState("");
    const [successMessage, setSuccessMessage] = React.useState("");

    const [formData, setFormData] = React.useState({
        username: user.username,
        password: "",
        fname: "",
        lname: "",
        mobile: "",
        email: "",
        age: "",
        gender: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        // Prepare data to send (exclude fields if empty)
        const dataToSend = {};
        for (const key in formData) {
            if (formData[key] !== "") {
                dataToSend[key] = formData[key];
            }
        }

		dataToSend["username"] = user.username;

        fetch("/update-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setSuccessMessage("Profile updated successfully.");
                } else {
                    setErrorMessage(data.message || "Failed to update profile.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setErrorMessage("An error occurred. Please try again later.");
            });
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            disabled
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="fname"
                            value={formData.fname}
                            onChange={handleChange}
                            placeholder={user.firstName}
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lname"
                            value={formData.lname}
                            onChange={handleChange}
                            placeholder={user.lastName}
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Mobile:
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder={user.mobileNo}
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={user.email}
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Age:
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder={user.age}
                        />
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        Gender:
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option disabled value="">{user.gender}</option>
                            <option value="M">M</option>
                            <option value="F">F</option>
                            <option value="O">O</option>
                        </select>
                    </label>
                </div>

                <button type="submit" className="submit-button">
                    Update Profile
                </button>
            </form>
        </div>
    );
}

ReactDOM.render(<UserProfile />, document.getElementById("root"));