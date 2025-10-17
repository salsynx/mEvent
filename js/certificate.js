// js/certificate.js
import { auth, db, storage } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

export async function generateCertificate(registrationId) {
    const user = auth.currentUser;
    if (!user) return alert("Login required");

    // Fetch registration details
    const regRef = doc(db, "registrations", registrationId);
    const regSnap = await getDoc(regRef);
    if (!regSnap.exists()) return alert("Registration not found");

    const data = regSnap.data();

    // Fetch event info
    const eventRef = doc(db, "events", data.eventId);
    const eventSnap = await getDoc(eventRef);
    const eventData = eventSnap.exists() ? eventSnap.data() : {};

    // Generate certificate using canvas
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#0055cc";
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title
    ctx.fillStyle = "#0055cc";
    ctx.font = "bold 40px Poppins";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Participation", canvas.width / 2, 120);

    // Participant Name
    ctx.fillStyle = "#333";
    ctx.font = "bold 32px Poppins";
    ctx.fillText(data.participantName || user.displayName, canvas.width / 2, 250);

    // Event Name
    ctx.font = "24px Poppins";
    ctx.fillText(For participating in "${eventData.name}", canvas.width / 2, 320);

    // Date
    ctx.font = "20px Poppins";
    ctx.fillText(Date: ${data.date}, canvas.width / 2, 400);

    // Footer
    ctx.font = "16px Poppins";
    ctx.fillText("College Event Manager", canvas.width / 2, canvas.height - 60);

    // Download
    const link = document.createElement("a");
    link.download = ${data.eventName}_certificate.png;
    link.href = canvas.toDataURL("image/png");
    link.click();
}