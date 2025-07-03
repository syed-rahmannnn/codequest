import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9R6JuDBJLxy9JjY89dZ8P_Fz7A-3mTRk",
  authDomain: "codequestcapstone.firebaseapp.com",
  projectId: "codequestcapstone",
  storageBucket: "codequestcapstone.firebasestorage.app",
  messagingSenderId: "381486714432",
  appId: "1:381486714432:web:f6fca4ad722ce782f259a5",
  databaseURL: "https://codequestcapstone-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// 🔐 LOGIN
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("currentUser", user.email);
      location.href = "index.html";
    })
    .catch((err) => {
      document.getElementById("authMessage").innerText = err.message;
    });
}

// 📝 REGISTER + INITIALIZE SCORE
function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      const user = userCredential.user;
      const userRef = ref(db, "users/" + user.uid);

      // Save user email + initial scores (0)
      set(userRef, {
        email: user.email,
        html: 0,
        css: 0,
        js: 0,
        python: 0,
        total: 0
      });

      document.getElementById("authMessage").innerText =
        "✅ Registered successfully! You can now log in.";
    })
    .catch((err) => {
      document.getElementById("authMessage").innerText = err.message;
    });
}

window.login = login;
window.register = register;
