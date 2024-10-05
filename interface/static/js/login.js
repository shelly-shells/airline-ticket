function Login() {
	function login() {
		const username = document.querySelector("input[type='text']").value;
		const password = document.querySelector("input[type='password']").value;

		fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
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
				<h1 className="center-text">Login</h1>
				<div className="error-message"></div>
				<label htmlFor="username">Username:</label>
				<input type="text" placeholder="Username" id="username" />
				<br />
				<label htmlFor="password">Password:</label>
				<input type="password" placeholder="Password" id="password" />
				<br />
				<button onClick={login}>Login</button>
				<br />
				<p className="center-text">
					Don't have an account? <a href="/register">Sign up</a>
				</p>
			</div>
		</div>
	);
}

ReactDOM.render(<Login />, document.getElementById("root"));
