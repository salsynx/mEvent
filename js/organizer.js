// Import Firebase modules
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const eventsTableBody = document.querySelector("table tbody");
const createEventForm = document.querySelector(".wizard-card");

// --- Organizer Dashboard: Load events for this organizer ---
async function loadOrganizerEvents() {
    if (!eventsTableBody) return;

    eventsTableBody.innerHTML = "<tr><td colspan='4'>Loading events...</td></tr>";

    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        eventsTableBody.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            // Only show events created by current organizer
            if (data.organizerId === auth.currentUser.uid) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.name}</td>
                    <td>${data.date}</td>
                    <td>${data.participants ? data.participants.length : 0}</td>
                    <td><button class="btn-edit" data-id="${docSnap.id}">Edit</button></td>
                `;
                eventsTableBody.appendChild(row);
            }
        });

        attachEditButtons();
    } catch (err) {
        console.error("Error fetching organizer events:", err);
        eventsTableBody.innerHTML = "<tr><td colspan='4'>Failed to load events</td></tr>";
    }
}

// --- Attach edit buttons ---
function attachEditButtons() {
    const editButtons = document.querySelectorAll(".btn-edit");
    editButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const eventId = btn.getAttribute("data-id");
            window.location.href = create-event.html?edit=${eventId};
        });
    });
}

// --- Create/Edit Event Page ---
async function handleCreateEditEvent() {
    if (!createEventForm) return;

    const urlParams = new URLSearchParams(window.location.search);
    const editEventId = urlParams.get("edit");

    // If editing, load event data
    if (editEventId) {
        try {
            const eventRef = doc(db, "events", editEventId);
            const eventSnap = await eventRef.get();
            if (eventSnap.exists()) {
                const data = eventSnap.data();
                createEventForm.querySelector('input[placeholder="Enter event name"]').value = data.name;
                createEventForm.querySelector('input[placeholder="Enter venue"]').value = data.venue;
                createEventForm.querySelector('input[type="date"]').value = data.date;
                createEventForm.querySelector('textarea').value = data.description;
            }
        } catch (err) {
            console.error("Error loading event data:", err);
        }
    }

    // Handle form submit
    createEventForm.querySelector(".btn").addEventListener("click", async (e) => {
        e.preventDefault();

        const name = createEventForm.querySelector('input[placeholder="Enter event name"]').value;
        const venue = createEventForm.querySelector('input[placeholder="Enter venue"]').value;
        const date = createEventForm.querySelector('input[type="date"]').value;
        const description = createEventForm.querySelector('textarea').value;

        if (!name || !venue || !date) {
            alert("Please fill in all required fields!");
            return;
        }

        try {
            if (editEventId) {
                // Update existing event
                const eventRef = doc(db, "events", editEventId);
                await updateDoc(eventRef, { name, venue, date, description });
                alert("Event updated successfully!");
            } else {
                // Create new event
                const eventRef = doc(collection(db, "events"));
                await setDoc(eventRef, {
                    name,
                    venue,
                    date,
                    description,
                    participants: [],
                    organizerId: auth.currentUser.uid
                });
                alert("Event created successfully!");
                createEventForm.reset();
            }
            window.location.href = "organizer.html"; // Redirect to dashboard
        } catch (err) {
            console.error("Error creating/updating event:", err);
            alert("Failed to save event. Try again!");
        }
    });
}

// --- Initialize ---
window.addEventListener("DOMContentLoaded", () => {
    loadOrganizerEvents();
    handleCreateEditEvent();
});