import { db, storage } from "./firebase-config.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { showAlert } from "./ui.js";

// DOM Elements
const tableBody = document.querySelector("table tbody");

// Fetch participant events
export async function loadParticipantEvents(userId) {
    try {
        const eventsCol = collection(db, "registrations");
        const q = query(eventsCol, where("userId", "==", userId));
        const snapshot = await getDocs(q);

        tableBody.innerHTML = "";

        snapshot.forEach(doc => {
            const data = doc.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${data.eventName}</td>
                <td>${data.date}</td>
                <td>${data.status}</td>
                <td><button class="btn-action download-btn" data-event="${data.eventId}">Download</button></td>
                <td><button class="btn-action feedback-btn" data-event="${data.eventId}">Give Feedback</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Attach button events
        attachParticipantButtons();
    } catch (err) {
        console.error(err);
        showAlert("Failed to load your events", "error");
    }
}

// Handle certificate download
function attachParticipantButtons() {
    const downloadBtns = document.querySelectorAll(".download-btn");
    downloadBtns.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const eventId = e.target.dataset.event;
            try {
                const certRef = ref(storage, certificates/${eventId}.pdf);
                const url = await getDownloadURL(certRef);
                window.open(url, "_blank");
                showAlert("Certificate opened successfully");
            } catch (err) {
                console.error(err);
                showAlert("Certificate not available", "error");
            }
        });
    });

    const feedbackBtns = document.querySelectorAll(".feedback-btn");
    feedbackBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const eventId = btn.dataset.event;
            const feedback = prompt("Enter your feedback:");
            if (feedback) {
                submitFeedback(eventId, feedback);
            }
        });
    });
}

// Submit feedback
async function submitFeedback(eventId, feedbackText) {
    try {
        const feedbackRef = collection(db, "feedbacks");
        await feedbackRef.add({
            eventId,
            feedback: feedbackText,
            timestamp: new Date()
        });
        showAlert("Feedback submitted successfully!");
    } catch (err) {
        console.error(err);
        showAlert("Failed to submit feedback", "error");
    }
}