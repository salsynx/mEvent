// js/attendance.js
import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

/**
 * Mark attendance for a participant in an event.
 * @param {string} participantId - ID of the participant
 * @param {string} eventId - ID of the event
 */
export async function markAttendance(participantId, eventId) {
    try {
        const attendanceId = ${participantId}_${eventId};
        const attendanceRef = doc(db, "attendance", attendanceId);

        const docSnap = await getDoc(attendanceRef);
        if (docSnap.exists()) {
            console.log("Attendance already marked.");
            return { status: "exists", message: "Attendance already marked." };
        }

        await setDoc(attendanceRef, {
            participantId,
            eventId,
            timestamp: new Date()
        });

        console.log("Attendance marked successfully!");
        return { status: "success", message: "Attendance marked successfully." };

    } catch (error) {
        console.error("Error marking attendance:", error);
        return { status: "error", message: error.message };
    }
}

/**
 * Fetch attendance info for a participant
 * @param {string} participantId
 */
export async function getParticipantAttendance(participantId) {
    try {
        const eventAttendance = [];
        // TODO: You can expand this with query to fetch all events participant attended
        // For now, fetching by known IDs or from 'attendance' collection
        console.log("Fetching attendance for participant:", participantId);
        return eventAttendance;
    } catch (error) {
        console.error(error);
        return [];
    }
}