// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqoD99PkzmeP07y2lc_W1184xq5LT2Y60",
  authDomain: "expense-tracker-1884d.firebaseapp.com",
  projectId: "expense-tracker-1884d",
  storageBucket: "expense-tracker-1884d.firebasestorage.app",
  messagingSenderId: "23802297389",
  appId: "1:23802297389:web:3308130af7d2a4a4350ca4",
  measurementId: "G-NG4WJQS534"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);