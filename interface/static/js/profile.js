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
				<button
					className="my-bookings"
					onClick={() => (window.location.href = "/myBookings")}
				>
					My Bookings
				</button>
				<button
					className="home"
					onClick={() => (window.location.href = "/home")}
				>
					Home
				</button>
				<div className="user-profile">
					<button onClick={toggleDropdown} className="profile-button">
						User Profile
					</button>
					{showDropdown && (
						<div className="dropdown">
							<button
								onClick={() =>
									(window.location.href = "/profile")
								}
							>
								Profile
							</button>
							<button
								onClick={() =>
									(window.location.href = "/logout")
								}
							>
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function UserProfile() {
	const [user, setUser] = React.useState(
		JSON.parse(document.getElementById("thissucks").dataset.user)
	);
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

		if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
			setErrorMessage("Mobile number must be exactly 10 digits.");
			return;
		}

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (formData.email && !emailRegex.test(formData.email)) {
			setErrorMessage("Invalid email format.");
			return;
		}

		if (formData.age && (isNaN(formData.age) || formData.age <= 18)) {
			setErrorMessage("Age must be more than 18.");
			return;
		}

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
					setErrorMessage(
						data.message || "Failed to update profile."
					);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setErrorMessage("An error occurred. Please try again later.");
			});
	};

	return (
		<div>
			<TopBar />
			<div className="profile-container">
				<h1>Profile</h1>
				{errorMessage && (
					<div className="error-message">{errorMessage}</div>
				)}
				{successMessage && (
					<div className="success-message">{successMessage}</div>
				)}
				<form onSubmit={handleSubmit} className="profile-form">
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							name="username"
							id="username"
							value={user.username}
							disabled
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password:</label>
						<input
							type="password"
							name="password"
							id="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Enter new password"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="fname">First Name:</label>
						<input
							type="text"
							name="fname"
							id="fname"
							value={formData.fname}
							onChange={handleChange}
							placeholder={user.firstName}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="lname">Last Name:</label>
						<input
							type="text"
							name="lname"
							id="lname"
							value={formData.lname}
							onChange={handleChange}
							placeholder={user.lastName}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="mobile">Mobile:</label>
						<input
							type="text"
							name="mobile"
							id="mobile"
							value={formData.mobile}
							onChange={handleChange}
							placeholder={user.mobileNo}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email">Email:</label>
						<input
							type="email"
							name="email"
							id="email"
							value={formData.email}
							onChange={handleChange}
							placeholder={user.email}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="age">Age:</label>
						<input
							type="number"
							name="age"
							id="age"
							value={formData.age}
							onChange={handleChange}
							placeholder={user.age}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="gender">Gender:</label>
						<select
							name="gender"
							id="gender"
							value={formData.gender}
							onChange={handleChange}
						>
							<option disabled value="">
								{user.gender}
							</option>
							<option value="M">M</option>
							<option value="F">F</option>
							<option value="O">O</option>
						</select>
					</div>

					<button type="submit" className="submit-button">
						Update Profile
					</button>
				</form>
			</div>
		</div>
	);
}

ReactDOM.render(<UserProfile />, document.getElementById("root"));
