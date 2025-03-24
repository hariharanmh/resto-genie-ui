import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMsd5wl0Xo4dCXSK_HkmiIZY-6K9rdT0s",
  authDomain: "restogenie.firebaseapp.com",
  databaseURL: "https://restogenie-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "restogenie",
  storageBucket: "restogenie.firebasestorage.app",
  messagingSenderId: "36836288075",
  appId: "1:36836288075:web:85a2f560a1ab83c9a54fce",
  measurementId: "G-82JBP0QH2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);