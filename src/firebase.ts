import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWJ2M_lJmMUWfFDbItiRh73RRvIGXSYSg",
  authDomain: "preschooldemo-e350e.firebaseapp.com",
  projectId: "preschooldemo-e350e",
  storageBucket: "preschooldemo-e350e.firebasestorage.app",
  messagingSenderId: "1053542139222",
  appId: "1:1053542139222:web:6fc6265efc6ed3bde8c2f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection Names mapping from the original app.js
export const COLUMNS = {
  STUDENTS: "sc_students",
  ADMISSIONS: "sc_admissions",
  ATTENDANCE: "sc_attendance",
  FEES: "sc_fees",
  TEACHERS: "sc_teachers"
};

export const ALL_CLASSES = ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
