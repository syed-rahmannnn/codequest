// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9R6JuDBJLxy9JjY89dZ8P_Fz7A-3mTRk",
  authDomain: "codequestcapstone.firebaseapp.com",
  projectId: "codequestcapstone",
  storageBucket: "codequestcapstone.firebasestorage.app",
  messagingSenderId: "381486714432",
  appId: "1:381486714432:web:f6fca4ad722ce782f259a5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      localStorage.setItem("currentUser", email);
      location.href = "index.html";
    })
    .catch((err) => {
      document.getElementById("authMessage").innerText = err.message;
    });
}

function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
      document.getElementById("authMessage").innerText = "Registered! Please login.";
    })
    .catch((err) => {
      document.getElementById("authMessage").innerText = err.message;
    });
}

window.login = login;
window.register = register;
