document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("contactFeedback");
  const message = document.getElementById("contactMessage");
  const counter = document.getElementById("messageCount");

  message.addEventListener("input", () => {
    counter.textContent = message.value.length;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.className = "contact-feedback";
    feedback.textContent = "";

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value;
    const body = message.value.trim();

    if (!name || !email || !subject || !body) {
      feedback.classList.add("error");
      feedback.textContent = "Please fill in all required fields.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.classList.add("error");
      feedback.textContent = "Please enter a valid email address.";
      return;
    }
    if (body.length < 10) {
      feedback.classList.add("error");
      feedback.textContent = "Please enter a message of at least 10 characters.";
      return;
    }

    try {
      const key = "rideGoContactMessages";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push({
        id: "RG-MSG-" + Date.now(),
        name, email, subject, message: body,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem(key, JSON.stringify(existing));
      feedback.classList.add("success");
      feedback.textContent = "Thanks, " + name.split(/\s+/)[0] + "! Your message has been saved in this browser (demo only).";
      form.reset();
      counter.textContent = "0";
    } catch (error) {
      feedback.classList.add("error");
      feedback.textContent = "Unable to save the message in this browser. Please try again.";
      console.error("Contact form storage error:", error);
    }
  });
});
