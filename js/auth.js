import { auth, db } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

// REGISTER
export async function registerUser(name, email, password, role) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save extra info in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: role,
            createdAt: new Date()
        });

        alert("Registration successful!");
        window.location.href = "/login/login.html";

    } catch (error) {
        alert("Error: " + error.message);
    }
}

// LOGIN
export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");

        // Redirect based on role
        const user = auth.currentUser;
        // Fetch role from Firestore
        const userDoc = await db.collection("users").doc(user.uid).get();
        const role = userDoc.data().role;

        if(role === "Organizer") window.location.href = "/organizer-dashboard/organizer.html";
        else if(role === "Participant") window.location.href = "/participants-dashboard/participant.html";
        else window.location.href = "/admin-dashboard/admin.html";

    } catch (error) {
        alert("Error: " + error.message);
    }
}

// LOGOUT
export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = "/login/login.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
}