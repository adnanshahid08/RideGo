// ==========================================
// RideGo Dashboard JavaScript
// ==========================================


// ---------- Load Logged-in User ----------
function loadUserName() {

    const userNameElement =
        document.getElementById("userName");

    const savedUser =
        localStorage.getItem("rideGoLoggedInUser");

    if (!savedUser) {
        userNameElement.textContent = "Rider";
        return;
    }

    try {

        const user = JSON.parse(savedUser);

        const displayName = user.fullName || user.name || user.full_name || user.username || "";
        if (displayName.trim()) {
            userNameElement.textContent = displayName.trim().split(/\s+/)[0];
        } else if (user.email && user.email.includes("@")) {
            userNameElement.textContent = user.email.split("@")[0];
        } else {
            userNameElement.textContent = "Rider";
        }

    } catch (error) {

        console.error(
            "Unable to read logged-in user:",
            error
        );

        userNameElement.textContent = "Rider";
    }
}



// ---------- Get Ride History ----------
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



// ---------- Calculate Statistics ----------
function calculateStatistics() {

    const rides = getRides();

    const totalRides =
        rides.length;


    const completedRides =
        rides.filter(function (ride) {

            return ride.status === "Completed";

        }).length;


    const cancelledRides =
        rides.filter(function (ride) {

            return ride.status === "Cancelled";

        }).length;


    const totalSpent =
        rides
            .filter(function (ride) {

                return ride.status !== "Cancelled";

            })
            .reduce(function (total, ride) {

                return total +
                    Number(ride.fare || 0);

            }, 0);


    document.getElementById(
        "totalRides"
    ).textContent =
        totalRides;


    document.getElementById(
        "completedRides"
    ).textContent =
        completedRides;


    document.getElementById(
        "cancelledRides"
    ).textContent =
        cancelledRides;


    document.getElementById(
        "totalSpent"
    ).textContent =
        "₹" + totalSpent;
}



// ---------- Get Status Class ----------
function getStatusClass(status) {

    if (status === "Cancelled") {
        return "cancelled";
    }

    if (
        status === "Driver Assigned" ||
        status === "On the Way" ||
        status === "Started"
    ) {
        return "active";
    }

    return "completed";
}



// ---------- Display Recent Rides ----------
function displayRecentRides() {

    const rides =
        getRides();

    const recentContainer =
        document.getElementById("recentRides");

    const noRecentRides =
        document.getElementById("noRecentRides");


    if (rides.length === 0) {

        recentContainer.innerHTML = "";

        noRecentRides.style.display =
            "block";

        return;
    }


    noRecentRides.style.display =
        "none";

    recentContainer.innerHTML = "";


    const recentRides =
        rides
            .slice()
            .reverse()
            .slice(0, 5);


    recentRides.forEach(function (ride) {

        const date =
            new Date(ride.date);


        const formattedDate =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );


        const statusClass =
            getStatusClass(ride.status);


        recentContainer.innerHTML += `

            <div class="recent-card">

                <div class="recent-date">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${formattedDate}
                    </strong>

                </div>


                <div class="recent-route">

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


                <div class="recent-type">

                    ${ride.rideType}

                </div>


                <div class="recent-status">

                    <span class="ride-status ${statusClass}">

                        ${ride.status}

                    </span>

                </div>


                <div class="recent-fare">

                    ₹${ride.fare}

                </div>

            </div>

        `;
    });
}




/* ---------- Initialize Dashboard ---------- */
document.addEventListener("DOMContentLoaded", function () {
    loadUserName();
    calculateStatistics();
    displayRecentRides();
});
