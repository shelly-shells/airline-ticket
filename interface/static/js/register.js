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

        let valid = true;

        // Mobile number validation
        if (!/^\d{10}$/.test(mobile)) {
            valid = false;
            const mobileError = document.querySelector(".mobile-error");
            mobileError.innerHTML = "Mobile number must be exactly 10 digits.";
            document.querySelector(".mobile").classList.add("error");
        } else {
            document.querySelector(".mobile-error").innerHTML = "";
            document.querySelector(".mobile").classList.remove("error");
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            valid = false;
            const emailError = document.querySelector(".email-error");
            emailError.innerHTML = "Invalid email format.";
            document.querySelector(".email").classList.add("error");
        } else {
            document.querySelector(".email-error").innerHTML = "";
            document.querySelector(".email").classList.remove("error");
        }

        // Age validation
        if (isNaN(age) || age <= 18) {
            valid = false;
            const ageError = document.querySelector(".age-error");
            ageError.innerHTML = "Age must be more than 18.";
            document.querySelector(".age").classList.add("error");
        } else {
            document.querySelector(".age-error").innerHTML = "";
            document.querySelector(".age").classList.remove("error");
        }

        if (!valid) {
            return;
        }

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
                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            className="username"
                            type="text"
                            placeholder="Username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            className="password"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="fname">First Name:</label>
                        <input
                            className="fname"
                            type="text"
                            placeholder="First Name"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="lname">Last Name:</label>
                        <input
                            className="lname"
                            type="text"
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="mobile">Mobile:</label>
                        <input
                            className="mobile"
                            type="text"
                            placeholder="Mobile"
                        />
                        <div className="mobile-error error-message"></div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            className="email"
                            type="text"
                            placeholder="Email"
                        />
                        <div className="email-error error-message"></div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="age">Age:</label>
                        <input className="age" type="text" placeholder="Age" />
                        <div className="age-error error-message"></div>
                    </div>
                </div>
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
