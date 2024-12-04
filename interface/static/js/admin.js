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
                <div className="user-profile">
                    <button onClick={toggleDropdown} className="profile-button">
                        Logout
                    </button>
                    {showDropdown && (
                        <div className="dropdown">
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

function AdminPage() {
    return (
        <div>
            <TopBar />
            <div className="admin-container">
                <div className="admin-options">
                    <button
                        onClick={() =>
                            (window.location.href = "/admin/flights")
                        }
                    >
                        Manage Flights
                    </button>
                    <button
                        onClick={() => (window.location.href = "/admin/routes")}
                    >
                        Manage Routes
                    </button>
                    <button
                        onClick={() => (window.location.href = "/admin/cities")}
                    >
                        Manage Cities
                    </button>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<AdminPage />, document.getElementById("root"));
