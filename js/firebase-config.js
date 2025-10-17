// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_OLOYCwN_ZZ6CQzQVH7GQUmLmqGL7cAw",
    authDomain: "tm-hackattack.firebaseapp.com",
    projectId: "tm-hackattack",
    storageBucket: "tm-hackattack.appspot.com",
    messagingSenderId: "966121168769",
    appId: "1:966121168769:web:a46174503a5605a7e4d280",
    measurementId: "G-7E8E8M715P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);