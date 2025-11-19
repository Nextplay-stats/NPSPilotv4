// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbPwNLF7EZpTM5wNnKh0VvfyHj4Lr5UnY",
  authDomain: "npsv4-f44a0.firebaseapp.com",
  projectId: "npsv4-f44a0",
  storageBucket: "npsv4-f44a0.firebasestorage.app",
  messagingSenderId: "566833344372",
  appId: "1:566833344372:web:8a1cff28d1d306aad5c621",
  measurementId: "G-QJ4HJF8P9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
