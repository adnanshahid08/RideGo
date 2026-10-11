// ==========================================
// RideGo - My Rides JavaScript
// ==========================================


// ==========================================
// GET ALL RIDES
// ==========================================

function getRides() {

    const savedRides =
        localStorage.getItem("rideGoBookings");

    if (!savedRides) {
        return [];
    }

    try {

        return JSON.parse(savedRides);

    } catch (error) {

        console.error(
            "Unable to read ride history:",
            error
        );

        return [];
    }
}



// ==========================================
// SAVE ALL RIDES
// ==========================================

function saveRides(rides) {

    localStorage.setItem(
        "rideGoBookings",
        JSON.stringify(rides)
    );

}



// ==========================================
// GET CURRENT BOOKING
// ==========================================

function getCurrentBooking() {

    const savedBooking =
        localStorage.getItem(
            "rideGoCurrentBooking"
        );

    if (!savedBooking) {
        return null;
    }

    try {

        return JSON.parse(savedBooking);

    } catch (error) {

        console.error(
            "Unable to read current booking:",
            error
        );

        return null;
    }

}



// ==========================================
// DISPLAY CURRENT RIDE
// ==========================================

function displayCurrentRide() {

    const currentRideContainer =
        document.getElementById(
            "currentRide"
        );

    const noCurrentRide =
        document.getElementById(
            "noCurrentRide"
        );


    const currentBooking =
        getCurrentBooking();


    const rides =
        getRides();


    // Find the current booking in ride history
    let activeRide = null;


    if (currentBooking) {

        activeRide =
            rides.find(function (ride) {

                return ride.bookingId ===
                    currentBooking.bookingId;

            });

    }


    // If booking does not exist in history
    if (!activeRide && currentBooking) {

        activeRide = currentBooking;

    }


    // Check whether ride is active
    const activeStatuses = [
        "Driver Assigned",
        "On the Way",
        "Started"
    ];


    if (
        !activeRide ||
        !activeStatuses.includes(
            activeRide.status
        )
    ) {

        currentRideContainer.innerHTML = "";

        currentRideContainer.style.display =
            "none";

        noCurrentRide.style.display =
            "block";

        return;
    }


    // Show current ride
    currentRideContainer.style.display =
        "block";

    noCurrentRide.style.display =
        "none";


    currentRideContainer.innerHTML = `

        <div class="current-ride-top">

            <div>

                <span class="booking-label">
                    BOOKING ID
                </span>

                <strong>
                    ${activeRide.bookingId}
                </strong>

            </div>


            <span class="ride-status active">
                <i class="bi bi-person-check-fill"></i>

                ${activeRide.status}

            </span>

        </div>


        <div class="current-route">

            <div class="route-location">

                <i class="bi bi-circle-fill"></i>

                <div>

                    <span>
                        Pickup
                    </span>

                    <strong>
                        ${activeRide.pickup}
                    </strong>

                </div>

            </div>


            <div class="route-arrow">

                <i class="bi bi-arrow-right"></i>

            </div>


            <div class="route-location">

                <i class="bi bi-geo-alt-fill"></i>

                <div>

                    <span>
                        Destination
                    </span>

                    <strong>
                        ${activeRide.destination}
                    </strong>

                </div>

            </div>

        </div>


        <div class="ride-info-grid">


            <div class="ride-info-item">

                <span>
                    Ride
                </span>

                <strong>
                    ${activeRide.rideType}
                </strong>

            </div>


            <div class="ride-info-item">

                <span>
                    Distance
                </span>

                <strong>
                    ${activeRide.distance} km
                </strong>

            </div>


            <div class="ride-info-item">

                <span>
                    Time
                </span>

                <strong>
                    ${activeRide.estimatedTime} min
                </strong>

            </div>


            <div class="ride-info-item">

                <span>
                    Fare
                </span>

                <strong>
                    ₹${activeRide.fare}
                </strong>

            </div>

        </div>


        <div class="driver-mini-card">

            <div class="driver-avatar">

                <i class="bi bi-person-fill"></i>

            </div>


            <div class="driver-details">

                <strong>
                    Rahul Sharma
                </strong>

                <span>
                    Driver • MH 05 AB 1234
                </span>

            </div>

        </div>


        <div class="ride-actions">

            <button
                class="cancel-ride-btn"
                onclick="cancelRide('${activeRide.bookingId}')">

                <i class="bi bi-x-circle"></i>

                Cancel Ride

            </button>

        </div>

    `;
}



// ==========================================
// CANCEL RIDE
// ==========================================

function cancelRide(bookingId) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this ride?"
        );


    if (!confirmCancel) {
        return;
    }


    let rides =
        getRides();


    // Find booking
    const rideIndex =
        rides.findIndex(function (ride) {

            return ride.bookingId ===
                bookingId;

        });


    if (rideIndex === -1) {

        alert(
            "Ride not found."
        );

        return;
    }


    // Prevent cancelling already cancelled ride
    if (
        rides[rideIndex].status ===
        "Cancelled"
    ) {

        alert(
            "This ride is already cancelled."
        );

        return;
    }


    // Prevent cancelling completed ride
    if (
        rides[rideIndex].status ===
        "Completed"
    ) {

        alert(
            "Completed rides cannot be cancelled."
        );

        return;
    }


    // Update status
    rides[rideIndex].status =
        "Cancelled";


    // Add cancellation time
    rides[rideIndex].cancelledAt =
        new Date().toISOString();


    // Save updated rides
    saveRides(rides);


    // Update current booking
    const currentBooking =
        getCurrentBooking();


    if (
        currentBooking &&
        currentBooking.bookingId ===
            bookingId
    ) {

        currentBooking.status =
            "Cancelled";


        currentBooking.cancelledAt =
            new Date().toISOString();


        localStorage.setItem(
            "rideGoCurrentBooking",
            JSON.stringify(
                currentBooking
            )
        );

    }


    alert(
        "Ride cancelled successfully."
    );


    // Refresh page content
    displayCurrentRide();

    displayRideHistory();

}



// ==========================================
// DISPLAY RIDE HISTORY
// ==========================================

function displayRideHistory() {

    const historyContainer =
        document.getElementById(
            "ridesHistory"
        );


    const noHistory =
        document.getElementById(
            "noHistory"
        );


    const rides =
        getRides();


    // No rides
    if (rides.length === 0) {

        historyContainer.innerHTML = "";

        noHistory.style.display =
            "block";

        return;
    }


    noHistory.style.display =
        "none";


    historyContainer.innerHTML =
        "";


    // Latest ride first
    const history =
        rides
            .slice()
            .reverse();


    history.forEach(function (ride) {


        let statusClass =
            "completed";


        if (
            ride.status ===
            "Cancelled"
        ) {

            statusClass =
                "cancelled";

        } else if (
            ride.status ===
            "Driver Assigned"
        ) {

            statusClass =
                "active";

        } else if (
            ride.status ===
            "On the Way"
        ) {

            statusClass =
                "active";

        } else if (
            ride.status ===
            "Started"
        ) {

            statusClass =
                "active";

        }


        const date =
            new Date(
                ride.date
            );


        const formattedDate =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );


        historyContainer.innerHTML += `

            <div class="history-card">


                <div class="history-date">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${formattedDate}
                    </strong>

                </div>



                <div class="history-route">

                    <i class="bi bi-geo-alt-fill"></i>

                    <div>

                        <strong>
                            ${ride.pickup}
                        </strong>

                        <span>
                            → ${ride.destination}
                        </span>

                    </div>

                </div>



                <div class="history-ride-type">

                    <span>
                        Ride
                    </span>

                    <strong>
                        ${ride.rideType}
                    </strong>

                </div>



                <div class="history-status">

                    <span class="ride-status ${statusClass}">

                        ${ride.status}

                    </span>

                </div>



                <div class="history-fare">

                    ₹${ride.fare}

                </div>


            </div>

        `;
    });
}



// ==========================================
// INITIALIZE PAGE
// ==========================================

displayCurrentRide();

displayRideHistory();