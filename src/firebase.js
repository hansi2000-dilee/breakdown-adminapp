import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyAcq1BqiR-ttBcY0ig1_9jCpWOzNWyGfpo",
  authDomain: "breakdown-report-employee.firebaseapp.com",
  databaseURL: "https://breakdown-report-employee-default-rtdb.firebaseio.com",
  projectId: "breakdown-report-employee",
  storageBucket: "breakdown-report-employee.firebasestorage.app",
  messagingSenderId: "844952973867",
  appId: "1:844952973867:web:1e03a2bd864201c81bb06e",
  measurementId: "G-2XC49DYPBG"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;