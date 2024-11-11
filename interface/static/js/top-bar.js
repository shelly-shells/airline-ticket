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
                <button className="home">Home</button>
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
