import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBklRtHZE1njTqAAiywNEiNF_t6Yaa4eXs",
  authDomain: "sk-web-dev-41979.firebaseapp.com",
  projectId: "sk-web-dev-41979",
  storageBucket: "sk-web-dev-41979.firebasestorage.app",
  messagingSenderId: "459204081062",
  appId: "1:459204081062:web:1933ff113d67d54a964b67",
  measurementId: "G-HR84M3WZKP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

