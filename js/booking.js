/* =====================================================
   RIDEGO - BOOKING SYSTEM
   ===================================================== */


/* =====================================================
   SAMPLE LOCATION DISTANCES
   ===================================================== */

const distances = {

    badlapur: {
        ambernath: 8,
        kalyan: 14,
        ulhasnagar: 18,
        dombivli: 24,
        thane: 38,
        mumbra: 30
    },

    ambernath: {
        badlapur: 8,
        kalyan: 9,
        ulhasnagar: 13,
        dombivli: 19,
        thane: 32,
        mumbra: 24
    },

    kalyan: {
        badlapur: 14,
        ambernath: 9,
        ulhasnagar: 5,
        dombivli: 11,
        thane: 24,
        mumbra: 16
    },

    ulhasnagar: {
        badlapur: 18,
        ambernath: 13,
        kalyan: 5,
        dombivli: 9,
        thane: 20,
        mumbra: 18
    },

    dombivli: {
        badlapur: 24,
        ambernath: 19,
        kalyan: 11,
        ulhasnagar: 9,
        thane: 15,
        mumbra: 21
    },

    thane: {
        badlapur: 38,
        ambernath: 32,
        kalyan: 24,
        ulhasnagar: 20,
        dombivli: 15,
        mumbra: 10
    },

    mumbra: {
        badlapur: 30,
        ambernath: 24,
        kalyan: 16,
        ulhasnagar: 18,
        dombivli: 21,
        thane: 10
    }

};


/* =====================================================
   LOCATION NAMES
   ===================================================== */

const locationNames = {

    badlapur: "Badlapur Station",

    ambernath: "Ambernath",

    kalyan: "Kalyan",

    ulhasnagar: "Ulhasnagar",

    dombivli: "Dombivli",

    thane: "Thane",

    mumbra: "Mumbra"

};


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const pickupSelect =
    document.getElementById("pickup");

const destinationSelect =
    document.getElementById("destination");

const calculateBtn =
    document.getElementById("calculateBtn");

const locationError =
    document.getElementById("locationError");

const rideCards =
    document.querySelectorAll(".booking-ride-card");

const summaryPickup =
    document.getElementById("summaryPickup");

const summaryDestination =
    document.getElementById("summaryDestination");

const summaryDistance =
    document.getElementById("summaryDistance");

const summaryTime =
    document.getElementById("summaryTime");

const summaryRide =
    document.getElementById("summaryRide");

const summaryFare =
    document.getElementById("summaryFare");

const formulaText =
    document.getElementById("formulaText");

const confirmBtn =
    document.getElementById("confirmBtn");


/* =====================================================
   BOOKING VARIABLES
   ===================================================== */

let selectedRide = null;

let currentDistance = 0;

let currentFare = 0;

let currentTime = 0;


/* =====================================================
   CALCULATE DISTANCE
   ===================================================== */

function getDistance(pickup, destination) {

    if (
        distances[pickup] &&
        distances[pickup][destination]
    ) {
        return distances[pickup][destination];
    }

    return 0;
}


/* =====================================================
   CALCULATE TRAVEL TIME
   ===================================================== */

function getTravelTime(distance) {

    /*
        Simple academic calculation:

        Average speed = approximately 30 km/h

        Time = distance / speed

        We convert the result to minutes.
    */

    const speed = 30;

    const time =
        Math.round((distance / speed) * 60);

    return Math.max(time, 5);
}


/* =====================================================
   CALCULATE FARE
   ===================================================== */

function calculateFare(baseFare, rate, distance) {

    return baseFare + (distance * rate);

}


/* =====================================================
   CALCULATE BUTTON
   ===================================================== */

calculateBtn.addEventListener("click", function () {

    const pickup = pickupSelect.value;

    const destination = destinationSelect.value;


    /* Validation */

    if (pickup === "" || destination === "") {

        locationError.textContent =
            "Please select both pickup and destination.";

        return;
    }


    if (pickup === destination) {

        locationError.textContent =
            "Pickup and destination cannot be the same.";

        return;
    }


    locationError.textContent = "";


    /* Calculate distance */

    currentDistance =
        getDistance(pickup, destination);


    if (currentDistance === 0) {

        locationError.textContent =
            "Distance information is not available.";

        return;
    }


    /* Calculate time */

    currentTime =
        getTravelTime(currentDistance);


    /* Update summary */

    summaryPickup.textContent =
        locationNames[pickup];

    summaryDestination.textContent =
        locationNames[destination];

    summaryDistance.textContent =
        currentDistance + " km";

    summaryTime.textContent =
        currentTime + " min";


    /*
        If a ride was already selected,
        calculate its fare.
    */

    if (selectedRide !== null) {

        updateFare();

    }


    /* Scroll to ride selection */

    document.getElementById("rideSelection")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* =====================================================
   RIDE CARD SELECTION
   ===================================================== */

rideCards.forEach(function (card) {

    card.addEventListener("click", function () {

        /* Remove previous selection */

        rideCards.forEach(function (item) {

            item.classList.remove("selected");

        });


        /* Select current ride */

        card.classList.add("selected");


        selectedRide = {

            name: card.dataset.ride,

            base: Number(card.dataset.base),

            rate: Number(card.dataset.rate),

            passengers: Number(card.dataset.passengers)

        };


        /* Update fare if distance exists */

        if (currentDistance > 0) {

            updateFare();

        }

    });

});


/* =====================================================
   UPDATE FARE
   ===================================================== */

function updateFare() {

    if (selectedRide === null) {
        return;
    }


    if (currentDistance === 0) {
        return;
    }


    currentFare = calculateFare(

        selectedRide.base,

        selectedRide.rate,

        currentDistance

    );


    /* Update summary */

    summaryRide.textContent =
        selectedRide.name;


    summaryFare.textContent =
        "₹" + currentFare;


    /* Show formula */

    formulaText.textContent =
        "₹" +
        selectedRide.base +
        " base + (" +
        currentDistance +
        " km × ₹" +
        selectedRide.rate +
        "/km) = ₹" +
        currentFare;


    /* Enable confirmation */

    confirmBtn.disabled = false;

}


/* =====================================================
   CONFIRM BOOKING
   ===================================================== */

confirmBtn.addEventListener("click", function () {

    if (
        selectedRide === null ||
        currentDistance === 0
    ) {

        alert(
            "Please select locations and a ride first."
        );

        return;
    }


    const pickup =
        pickupSelect.value;

    const destination =
        destinationSelect.value;


    /*
        Temporary booking object.

        Later this will be sent
        to our Express.js backend.
    */

    const booking = {

        bookingId:
            "RG-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            ),

        pickup:
            locationNames[pickup],

        destination:
            locationNames[destination],

        rideType:
            selectedRide.name,

        distance:
            currentDistance,

        fare:
            currentFare,

        estimatedTime:
            currentTime,

        status:
            "Driver Assigned",

        date:
            new Date().toLocaleDateString("en-IN")

    };


    /*
        Save temporarily in LocalStorage.

        Later we will connect this
        with the Express backend.
    */

    localStorage.setItem(
        "rideGoCurrentBooking",
        JSON.stringify(booking)
    );


    /*
        Go to confirmation page.

        We will create this page
        in the next step.
    */

    window.location.href =
        "booking-confirmation.html";

});


/* =====================================================
   READ HOMEPAGE LOCATION PARAMETERS
   ===================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );

const homePickup =
    params.get("pickup");

const homeDestination =
    params.get("destination");


/*
    If user came from homepage
    with locations, try to select them.
*/

if (homePickup) {

    const pickupOption =
        Array.from(
            pickupSelect.options
        ).find(function (option) {

            return option.textContent.trim()
                .toLowerCase()
                === homePickup.trim().toLowerCase();

        });


    if (pickupOption) {

        pickupSelect.value =
            pickupOption.value;

    }

}


if (homeDestination) {

    const destinationOption =
        Array.from(
            destinationSelect.options
        ).find(function (option) {

            return option.textContent.trim()
                .toLowerCase()
                === homeDestination.trim().toLowerCase();

        });


    if (destinationOption) {

        destinationSelect.value =
            destinationOption.value;

    }

}
