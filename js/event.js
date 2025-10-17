// Import Firebase modules
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const eventsGrid = document.querySelector(".events-grid");

// --- Load all upcoming events ---
async function loadEvents() {
    if (!eventsGrid) return;

    eventsGrid.innerHTML = "<p>Loading events...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        eventsGrid.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const card = document.createElement("div");
            card.classList.add("event-card");
            card.innerHTML = `
                <div class="event-title">${data.name}</div>
                <div class="event-date">📅 ${data.date}</div>
                <div class="event-desc">${data.description}</div>
                <button class="join-btn" data-id="${docSnap.id}">Join Event</button>
            `;
            eventsGrid.appendChild(card);
        });

        attachJoinButtons();
    } catch (err) {
        console.error("Error fetching events:", err);
        eventsGrid.innerHTML = "<p>Failed to load events.</p>";
    }
}

// --- Attach join buttons ---
function attachJoinButtons() {
    const joinButtons = document.querySelectorAll(".join-btn");
    joinButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
            if (!auth.currentUser) {
                alert("Please login to join an event.");
                return;
            }

            const eventId = btn.getAttribute("data-id");
            try {
                const eventRef = doc(db, "events", eventId);
                await updateDoc(eventRef, {
                    participants: arrayUnion(auth.currentUser.uid)
                });
                alert("You have successfully joined the event!");
                btn.disabled = true;
                btn.innerText = "Joined";
            } catch (err) {
                console.error("Error joining event:", err);
                alert("Failed to join the event. Try again!");
            }
        });
    });
}

// --- Initialize ---
window.addEventListener("DOMContentLoaded", () => {
    loadEvents();
});