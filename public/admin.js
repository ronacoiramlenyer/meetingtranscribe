import { auth, db } from "../firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const adminPanel = document.getElementById("admin-panel");
const notAdmin = document.getElementById("not-admin");
const output = document.getElementById("output");

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `MEET-${part()}-${part()}`;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    notAdmin.hidden = false;
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists() || snap.data().role !== "admin") {
    notAdmin.hidden = false;
    return;
  }

  adminPanel.hidden = false;

  document.getElementById("generate-btn").onclick = async () => {
    const durationDays = Number(document.getElementById("duration").value);
    const code = generateCode();

    await setDoc(doc(db, "subscriptionCodes", code), {
      app: "meetingApp",
      durationDays,
      used: false,
      createdAt: serverTimestamp()
    });

    output.textContent = code;
  };
});
