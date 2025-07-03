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
  get
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9R6JuDBJLxy9JjY89dZ8P_Fz7A-3mTRk",
  authDomain: "codequestcapstone.firebaseapp.com",
  projectId: "codequestcapstone",
  storageBucket: "codequestcapstone.firebasestorage.app",
  messagingSenderId: "381486714432",
  appId: "1:381486714432:web:f6fca4ad722ce782f259a5",
  databaseURL: "https://codequestcapstone-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

function login() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;

  if (!validateEmail(email)) {
    document.getElementById("authMessage").innerText = "❌ Please enter a valid email format.";
    return;
  }

  signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("currentUser", user.email);

      // Fetch username from Firebase and save to localStorage
      const dbRef = ref(db, "users/" + user.uid);
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          localStorage.setItem("displayName", snapshot.val().username || "Unknown");
        }
        location.href = "index.html";
      });
    })
    .catch((err) => {
      document.getElementById("authMessage").innerText = err.message;
    });
}

function register() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  const username = document.getElementById("username").value.trim();

  if (!validateEmail(email)) {
    document.getElementById("authMessage").innerText = "❌ Please enter a valid email format.";
    return;
  }

  if (username === "") {
    document.getElementById("authMessage").innerText = "❌ Please enter a username.";
    return;
  }

  createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      const user = userCredential.user;
      const userRef = ref(db, "users/" + user.uid);

      set(userRef, {
        email: user.email,
        username: username,
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
