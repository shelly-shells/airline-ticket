function Register() {
	function register() {
		const username = document.querySelector(".username").value;
		const password = document.querySelector(".password").value;
		const fname = document.querySelector(".fname").value;
		const lname = document.querySelector(".lname").value;
		const mobile = document.querySelector(".mobile").value;
		const email = document.querySelector(".email").value;
		const age = document.querySelector(".age").value;
		const gender = document.querySelector(
			"input[name='gender']:checked"
		).value;

		fetch("/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
				fname,
				lname,
				mobile,
				email,
				age,
				gender,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (data.status === "success") {
					window.location.href = "/home";
				} else {
					let err = document.querySelector(".error-message");
					err.innerHTML = "Invalid username or password";
				}
			});
	}

	return (
		<div>
			<TopBar />
			<div className="login-container">
				<h1 className="center-text">Register</h1>
				<div className="error-message"></div>
				<label htmlFor="username">Username:</label>
				<input
					className="username"
					type="text"
					placeholder="Username"
				/>
				<br />
				<label htmlFor="password">Password:</label>
				<input
					className="password"
					type="password"
					placeholder="Password"
				/>
				<br />
				<label htmlFor="fname">First Name:</label>
				<input className="fname" type="text" placeholder="First Name" />
				<br />
				<label htmlFor="lname">Last Name:</label>
				<input className="lname" type="text" placeholder="Last Name" />
				<br />
				<label htmlFor="mobile">Mobile:</label>
				<input className="mobile" type="text" placeholder="Mobile" />
				<br />
				<label htmlFor="email">Email:</label>
				<input className="email" type="text" placeholder="Email" />
				<br />
				<label htmlFor="age">Age:</label>
				<input className="age" type="text" placeholder="Age" />
				<br />
				<label>Gender:</label>
				<div className="gender-container">
					<input
						className="gender"
						type="radio"
						id="male"
						name="gender"
						value="M"
					/>
					<label htmlFor="male">Male</label>

					<input
						className="gender"
						type="radio"
						id="female"
						name="gender"
						value="F"
					/>
					<label htmlFor="female">Female</label>

					<input
						className="gender"
						type="radio"
						id="other"
						name="gender"
						value="O"
					/>
					<label htmlFor="other">Other</label>
				</div>
				<br />
				<button onClick={register}>Register</button>
				<br />
				<p className="center-text">
					Have an account? <a href="/">Login</a>
				</p>
			</div>
		</div>
	);
}

ReactDOM.render(<Register />, document.getElementById("root"));
