function AdminPage() {
    return (
        <div>
            <TopBar />
            <div className="admin-container">
                <h1 className="center-text">Admin Panel</h1>
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