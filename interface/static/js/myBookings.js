document.addEventListener("DOMContentLoaded", () => {
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

// Function to display each booking
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
        `;

        bookingsContainer.appendChild(bookingCard);
    });
}
