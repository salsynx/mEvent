import { db } from "./firebase-config.js";
import { collection, getDocs } from "firebase/firestore";
import { showAlert } from "./ui.js";

const calendarEl = document.getElementById("calendar");
const eventsListEl = document.getElementById("events-list");

let eventsData = [];

// Load events from Firestore
export async function loadCalendarEvents() {
    try {
        const eventsCol = collection(db, "events");
        const snapshot = await getDocs(eventsCol);
        eventsData = [];
        snapshot.forEach(doc => {
            eventsData.push({ id: doc.id, ...doc.data() });
        });
        renderCalendar(new Date());
    } catch (err) {
        console.error(err);
        showAlert("Failed to load events for calendar", "error");
    }
}

// Render simple month calendar
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Clear calendar
    calendarEl.innerHTML = "";

    // Get first day of month
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // Calendar header
    const header = document.createElement("div");
    header.className = "calendar-header";
    header.innerHTML = <h3>${date.toLocaleString('default', { month: 'long' })} ${year}</h3>;
    calendarEl.appendChild(header);

    // Days row
    const daysRow = document.createElement("div");
    daysRow.className = "calendar-days";
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    days.forEach(d => {
        const dEl = document.createElement("div");
        dEl.className = "calendar-day-name";
        dEl.textContent = d;
        daysRow.appendChild(dEl);
    });
    calendarEl.appendChild(daysRow);

    // Dates grid
    const datesGrid = document.createElement("div");
    datesGrid.className = "calendar-dates";

    // Empty cells before first day
    for(let i=0;i<firstDay;i++){
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-date empty";
        datesGrid.appendChild(emptyCell);
    }

    // Add days
    for(let d=1; d<=lastDate; d++){
        const dateCell = document.createElement("div");
        dateCell.className = "calendar-date";
        dateCell.textContent = d;

        const fullDate = new Date(year, month, d).toISOString().split("T")[0];
        const dayEvents = eventsData.filter(ev => ev.date === fullDate);

        if(dayEvents.length > 0){
            dateCell.classList.add("has-event");
            dateCell.addEventListener("click", () => showEventsForDate(fullDate));
        }

        datesGrid.appendChild(dateCell);
    }

    calendarEl.appendChild(datesGrid);
}

// Show events for a specific date
function showEventsForDate(dateStr){
    const dayEvents = eventsData.filter(ev => ev.date === dateStr);
    eventsListEl.innerHTML = "";

    if(dayEvents.length === 0){
        eventsListEl.textContent = "No events on this date.";
        return;
    }

    dayEvents.forEach(ev => {
        const div = document.createElement("div");
        div.className = "calendar-event";
        div.innerHTML = <strong>${ev.eventName}</strong> - ${ev.venue};
        eventsListEl.appendChild(div);
    });
}