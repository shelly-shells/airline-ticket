function Login() {
	return (
		<div className="login-container">
			<h1>Login</h1>
			<input type="text" placeholder="Username" />
			<br />
			<input type="password" placeholder="Password" />
			<br />
			<button>Login</button>
		</div>
	);
}

ReactDOM.render(<Login />, document.getElementById("root"));
