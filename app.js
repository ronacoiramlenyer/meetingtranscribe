import { auth, db } from "../firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



const screens = {
  login: document.getElementById("login-view"),
  subscribe: document.getElementById("subscribe-view"),
  locked: document.getElementById("locked-view"),
  app: document.getElementById("app-view")
};

function showScreen(name) {
  Object.values(screens).forEach(screen => {
    screen.hidden = true;
  });

  if (screens[name]) {
    screens[name].hidden = false;
  }
}

document.getElementById("subscribe-btn").addEventListener("click", () => {
  showScreen("subscribe");
});



const toast = document.getElementById("toast");
let toastTimer;

function showToast(message, type = "error") {
  if (!toast) return;

  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.hidden = false;

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.hidden = true;
    }, 300);
  }, 3000);
}


function normalizeAuthError(err) {
  if (!err || !err.code) {
    return "Something went wrong. Please try again.";
  }

  switch (err.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Incorrect email or password.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";

    case "auth/network-request-failed":
      return "Network error. Check your connection.";

    default:
      return "Unable to sign in right now.";
  }
}



/* =========================
   UI ELEMENTS
========================= */
const loginView = document.getElementById("login-view");
const lockedView = document.getElementById("locked-view");
const appView = document.getElementById("app-view");

function show(view) {
  loginView.hidden = true;
  lockedView.hidden = true;
  appView.hidden = true;
  view.hidden = false;
}

/* =========================
   AUTH + ACCESS LOGIC
========================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    show(loginView);
    return;
  }

  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      show(lockedView);
      return;
    }

    const data = snap.data();
    const meetingApp = data.apps?.meetingApp;

    // ── CASE 1: legacy boolean access ──
    if (meetingApp === true) {
      show(appView);
      return;
    }

    // ── CASE 2: subscription object ──
    if (
      typeof meetingApp === "object" &&
      meetingApp.active === true &&
      meetingApp.expiresAt
    ) {
      const now = new Date();
      const expiry = new Date(meetingApp.expiresAt);

      if (now <= expiry) {
        show(appView);
        return;
      }
    }

    // ── Everything else ──
    show(lockedView);

  } catch (err) {
    console.error("Access check failed:", err);
    show(lockedView);
  }
});

/* =========================
   LOGIN HANDLER
========================= */
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // App-level validation
  if (!email || !password) {
    showToast("Please enter your email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showToast("Welcome back.", "success");
  } catch (err) {
    showToast(normalizeAuthError(err), "error");
  }
});


/* =========================*/
/*SIGNOUT*/
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.getElementById("logout-btn").addEventListener("click", async () => {
  await signOut(auth);
  location.reload(); // ← THIS is the missing clarity step
});


