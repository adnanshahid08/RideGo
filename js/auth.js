/* =====================================================
   RIDEGO AUTHENTICATION
   ===================================================== */


/* =====================================================
   HELPER FUNCTIONS
   ===================================================== */

function getUsers() {

    const users =
        localStorage.getItem("rideGoUsers");

    if (!users) {
        return [];
    }

    return JSON.parse(users);

}


function saveUsers(users) {

    localStorage.setItem(
        "rideGoUsers",
        JSON.stringify(users)
    );

}


function showMessage(message, type) {

    const messageBox =
        document.getElementById("authMessage");

    if (!messageBox) {
        return;
    }

    messageBox.textContent = message;

    messageBox.className =
        "auth-message " + type;

}


function clearMessage() {

    const messageBox =
        document.getElementById("authMessage");

    if (!messageBox) {
        return;
    }

    messageBox.textContent = "";

    messageBox.className =
        "auth-message";

}


/* =====================================================
   ERROR HANDLING
   ===================================================== */

function setError(inputId, errorId, message) {

    const input =
        document.getElementById(inputId);

    const error =
        document.getElementById(errorId);

    if (input) {
        input.classList.add("input-error");
    }

    if (error) {
        error.textContent = message;
    }

}


function clearError(inputId, errorId) {

    const input =
        document.getElementById(inputId);

    const error =
        document.getElementById(errorId);

    if (input) {
        input.classList.remove("input-error");
    }

    if (error) {
        error.textContent = "";
    }

}


/* =====================================================
   PASSWORD SHOW / HIDE
   ===================================================== */

const passwordButtons =
    document.querySelectorAll(".password-toggle");


passwordButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const targetId =
                button.getAttribute("data-target");

            const passwordInput =
                document.getElementById(targetId);

            const icon =
                button.querySelector("i");


            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                icon.className =
                    "bi bi-eye-slash";

            } else {

                passwordInput.type = "password";

                icon.className =
                    "bi bi-eye";

            }

        }
    );

});


/* =====================================================
   REGISTER
   ===================================================== */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            clearMessage();


            const fullName =
                document.getElementById("fullName")
                .value
                .trim();


            const email =
                document.getElementById("registerEmail")
                .value
                .trim()
                .toLowerCase();


            const mobile =
                document.getElementById("mobile")
                .value
                .trim();


            const password =
                document.getElementById("registerPassword")
                .value;


            const confirmPassword =
                document.getElementById("confirmPassword")
                .value;


            let isValid = true;


            /* =========================
               CLEAR OLD ERRORS
               ========================= */

            clearError(
                "fullName",
                "fullNameError"
            );

            clearError(
                "registerEmail",
                "emailError"
            );

            clearError(
                "mobile",
                "mobileError"
            );

            clearError(
                "registerPassword",
                "passwordError"
            );

            clearError(
                "confirmPassword",
                "confirmPasswordError"
            );


            /* =========================
               NAME VALIDATION
               ========================= */

            if (fullName.length < 3) {

                setError(
                    "fullName",
                    "fullNameError",
                    "Please enter your full name."
                );

                isValid = false;

            }


            /* =========================
               EMAIL VALIDATION
               ========================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                setError(
                    "registerEmail",
                    "emailError",
                    "Please enter a valid email address."
                );

                isValid = false;

            }


            /* =========================
               MOBILE VALIDATION
               ========================= */

            const mobilePattern =
                /^[6-9][0-9]{9}$/;


            if (!mobilePattern.test(mobile)) {

                setError(
                    "mobile",
                    "mobileError",
                    "Enter a valid 10-digit mobile number."
                );

                isValid = false;

            }


            /* =========================
               PASSWORD VALIDATION
               ========================= */

            if (password.length < 6) {

                setError(
                    "registerPassword",
                    "passwordError",
                    "Password must contain at least 6 characters."
                );

                isValid = false;

            }


            /* =========================
               CONFIRM PASSWORD
               ========================= */

            if (password !== confirmPassword) {

                setError(
                    "confirmPassword",
                    "confirmPasswordError",
                    "Passwords do not match."
                );

                isValid = false;

            }


            if (!isValid) {

                showMessage(
                    "Please correct the errors in the form.",
                    "error"
                );

                return;

            }


            /* =========================
               CHECK EXISTING USER
               ========================= */

            const users = getUsers();


            const existingUser =
                users.find(function(user) {

                    return user.email === email;

                });


            if (existingUser) {

                showMessage(
                    "An account with this email already exists.",
                    "error"
                );

                return;

            }


            /* =========================
               CREATE USER
               ========================= */

            const newUser = {

                id:
                    "USER-" +
                    Date.now(),

                fullName:
                    fullName,

                email:
                    email,

                mobile:
                    mobile,

                password:
                    password,

                createdAt:
                    new Date().toISOString()

            };


            users.push(newUser);

            saveUsers(users);


            /* =========================
               SUCCESS
               ========================= */

            showMessage(
                "Registration successful! Redirecting to login...",
                "success"
            );


            registerForm.reset();


            setTimeout(function() {

                window.location.href =
                    "login.html";

            }, 1200);

        }
    );

}


/* =====================================================
   LOGIN
   ===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            clearMessage();


            const email =
                document.getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


            const password =
                document.getElementById("loginPassword")
                .value;


            let isValid = true;


            clearError(
                "loginEmail",
                "loginEmailError"
            );

            clearError(
                "loginPassword",
                "loginPasswordError"
            );


            /* =========================
               EMAIL
               ========================= */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                setError(
                    "loginEmail",
                    "loginEmailError",
                    "Enter a valid email address."
                );

                isValid = false;

            }


            /* =========================
               PASSWORD
               ========================= */

            if (password.length === 0) {

                setError(
                    "loginPassword",
                    "loginPasswordError",
                    "Please enter your password."
                );

                isValid = false;

            }


            if (!isValid) {

                showMessage(
                    "Please enter valid login details.",
                    "error"
                );

                return;

            }


            /* =========================
               FIND USER
               ========================= */

            const users = getUsers();


            const user =
                users.find(function(user) {

                    return (
                        user.email === email &&
                        user.password === password
                    );

                });


            /* =========================
               WRONG LOGIN
               ========================= */

            if (!user) {

                showMessage(
                    "Incorrect email or password.",
                    "error"
                );

                return;

            }


            /* =========================
               LOGIN SUCCESS
               ========================= */

            const loggedInUser = {

                id:
                    user.id,

                fullName:
                    user.fullName,

                email:
                    user.email,

                mobile:
                    user.mobile

            };


            localStorage.setItem(
                "rideGoLoggedInUser",
                JSON.stringify(loggedInUser)
            );


            showMessage(
                "Login successful! Redirecting...",
                "success"
            );


            setTimeout(function() {

                window.location.href =
                    "index.html";

            }, 1000);

        }
    );

}
/* =========================
   NAVBAR AUTH STATE
========================= */

function updateNavbar() {

    const loginLink =
        document.getElementById("loginLink");

    const registerLink =
        document.getElementById("registerLink");

    const logoutLink =
        document.getElementById("logoutLink");

    const loggedInUser =
        localStorage.getItem("rideGoLoggedInUser");

    /* USER IS LOGGED IN */

    if (loggedInUser) {

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (registerLink) {
            registerLink.style.display = "none";
        }

        if (logoutLink) {
            logoutLink.style.display = "inline-flex";
        }

    }

    /* USER IS NOT LOGGED IN */

    else {

        if (loginLink) {
            loginLink.style.display = "inline-flex";
        }

        if (registerLink) {
            registerLink.style.display = "inline-flex";
        }

        if (logoutLink) {
            logoutLink.style.display = "none";
        }
    }
}


/* LOGOUT */

const logoutLink =
    document.getElementById("logoutLink");

if (logoutLink) {

    logoutLink.addEventListener("click", function(event) {

        event.preventDefault();

        localStorage.removeItem(
            "rideGoLoggedInUser"
        );

        window.location.href = "index.html";

    });
}


/* RUN */

updateNavbar();