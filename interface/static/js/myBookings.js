// Create and inject the top bar HTML
function createTopBar() {
    const topBar = document.createElement('div');
    topBar.className = 'top-bar';
    topBar.innerHTML = `
        <div class="logo">
            <img src="static/bookingo.png" alt="Brand Logo" height="30" />
        </div>
        <div class="nav-buttons">
            <button class="my-bookings" onclick="window.location.href='/myBookings'">
                My Bookings
            </button>
            <button class="home" onclick="window.location.href='/home'">Home</button>
            <div class="user-profile">
                <button class="profile-button">User Profile</button>
                <div class="dropdown" style="display: none;">
                    <button onclick="window.location.href='/profile'">Profile</button>
                    <button onclick="window.location.href='/logout'">Logout</button>
                </div>
            </div>
        </div>
    `;
    
    // Insert the top bar at the beginning of the body
    document.body.insertBefore(topBar, document.body.firstChild);

    // Add dropdown functionality
    const profileButton = topBar.querySelector('.profile-button');
    const dropdown = topBar.querySelector('.dropdown');
    
    profileButton.addEventListener('click', () => {
        const isHidden = dropdown.style.display === 'none';
        dropdown.style.display = isHidden ? 'block' : 'none';
    });
}

function showBookingDetails(bookingID) {
    fetch(`/api/booking-details?bookingID=${bookingID}`)
        .then(response => response.json())
        .then(data => {
            const detailsContainer = document.getElementById(`details-${bookingID}`);
            
            if (data.status === "success" && data.passengers.length > 0) {
                let detailsHtml = "<h4>Passenger Details:</h4>";
                data.passengers.forEach(passenger => {
                    detailsHtml += `
                        <p>Passenger No: ${passenger.passengerNo}</p>
                        <p>Name: ${passenger.firstName} ${passenger.lastName}</p>
                        <p>Gender: ${passenger.gender}</p>
                        <p>Age: ${passenger.age}</p>
                        <hr>
                    `;
                });
                detailsContainer.innerHTML = detailsHtml;
            } else {
                detailsContainer.innerHTML = "<p>No passenger details available</p>";
            }
        })
        .catch(err => console.error("Error fetching booking details:", err));
}

document.addEventListener("DOMContentLoaded", () => {
    // Create the top bar first
    createTopBar();

    const bookingsContainer = document.getElementById("bookings-container");

    // Fetch bookings for the logged-in user
    fetch("/api/my-bookings")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                displayBookings(data.bookings);
            } else {
                bookingsContainer.innerHTML = "<p>No bookings found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching bookings:", error);
            bookingsContainer.innerHTML = "<p>Error loading bookings.</p>";
        });
});

function displayBookings(bookings) {
    const bookingsContainer = document.getElementById("bookings-container");
    bookingsContainer.innerHTML = ""; // Clear previous content

    bookings.forEach((booking) => {
        const bookingCard = document.createElement("div");
        bookingCard.className = "booking-card";
        
        bookingCard.innerHTML = `
            <p><strong>Booking ID:</strong> ${booking.bookingID}</p>
            <p><strong>Flight ID:</strong> ${booking.flightID}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Adults:</strong> ${booking.adults}</p>
            <p><strong>Children:</strong> ${booking.children}</p>
            <p><strong>Seat Class:</strong> ${booking.seatClass}</p>
            <p><strong>Amount Paid:</strong> $${booking.amountPaid}</p>
            <p><strong>Food:</strong> ${booking.food ? "Yes" : "No"}</p>
            <p><strong>Extra Luggage:</strong> ${booking.extraLuggage ? "Yes" : "No"}</p>
            
            <!-- New "Show Details" button -->
            <button class="show-details-btn" data-id="${booking.bookingID}">Show Details</button>
            
            <!-- Container to display passenger details -->
            <div id="details-${booking.bookingID}" class="passenger-details" style="display: none;"></div>
            
            <button class="cancel-btn" data-id="${booking.bookingID}">Cancel Booking</button>
        `;

        bookingsContainer.appendChild(bookingCard);
    });

    // Add event listeners for "Show Details" buttons
    const detailsButtons = document.querySelectorAll(".show-details-btn");
    detailsButtons.forEach(button => {
        button.addEventListener("click", function () {
            const bookingId = this.getAttribute("data-id");
            const detailsContainer = document.getElementById(`details-${bookingId}`);

            // Toggle visibility
            const isVisible = detailsContainer.style.display === "block";
            if (isVisible) {
                detailsContainer.style.display = "none";
            } else {
                showBookingDetails(bookingId);
                detailsContainer.style.display = "block";
            }
        });
    });

    // Add event listeners for "Cancel Booking" buttons
    const cancelButtons = document.querySelectorAll(".cancel-btn");
    cancelButtons.forEach(button => {
        button.addEventListener("click", function () {
            const bookingId = this.getAttribute("data-id");
            cancelBooking(bookingId);
        });
    });
}

// Function to cancel a booking
function cancelBooking(bookingId) {
    fetch("/api/cancel-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingID: bookingId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert(data.message);
                // Refresh the booking list after successful cancellation
                fetchBookings();
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error("Error canceling booking:", error);
            alert("Error canceling booking.");
        });
}

// Function to re-fetch and display bookings after canceling
function fetchBookings() {
    fetch("/api/my-bookings")
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                displayBookings(data.bookings);
            } else {
                bookingsContainer.innerHTML = "<p>No bookings found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching bookings:", error);
            bookingsContainer.innerHTML = "<p>Error loading bookings.</p>";
        });
}