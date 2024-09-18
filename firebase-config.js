import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSy6YYj-NhIAH9f-N8_BTtlGZMZBuoPqU",
  authDomain: "teachtrack-47588.firebaseapp.com",
  projectId: "teachtrack-47588",
  storageBucket: "teachtrack-47588",
  messagingSenderId: "666985205222",
  appId: "1:666985205222:web:0be79fb95f2b6cd2195a27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };