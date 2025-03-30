dayjs.extend(dayjs_plugin_customParseFormat);

let countdownInterval = null;

function updateCountdown(eventTime) {
    const now = dayjs();
    const diff = eventTime.diff(now);

    if (diff <= 0) {
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        clearInterval(countdownInterval);
        return false;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
    return true;
}

document.getElementById("eventForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const dateInput = document.getElementById("eventDate").value;
    const timeInput = document.getElementById("eventTime").value;
    const eventDateTimeString = `${dateInput} ${timeInput}`;
    
    const eventTime = dayjs(eventDateTimeString, "DD.MM.YYYY HH:mm");
    
    if (!eventTime.isValid()) {
        alert("Please enter a valid date and time in DD.MM.YYYY HH:mm format");
        return;
    }

    if (eventTime.isBefore(dayjs())) {
        alert("Please select a future date and time");
        return;
    }

    // Clear any existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // Start the countdown
    updateCountdown(eventTime);
    countdownInterval = setInterval(() => updateCountdown(eventTime), 1000);
});