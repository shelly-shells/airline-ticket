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
					err = document.querySelector(".error-message");
					err.innerHTML = "Invalid username or password";
				}
			});
	}
	return (
		<div className="login-container">
			<h1>Login</h1>
			<div className="error-message"></div>
			<input type="text" placeholder="Username" />
			<br />
			<input type="password" placeholder="Password" />
			<br />
			<button onClick={login}>Login</button>
		</div>
	);
}

ReactDOM.render(<Login />, document.getElementById("root"));
