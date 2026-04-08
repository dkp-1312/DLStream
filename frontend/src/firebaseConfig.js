import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJDlCpHYLFe0nY9w8g9caDkiujJ3V5XpE",
  authDomain: "dlstream-32796.firebaseapp.com",
  projectId: "dlstream-32796",
  storageBucket: "dlstream-32796.firebasestorage.app",
  messagingSenderId: "292866177939",
  appId: "1:292866177939:web:63b2546bf2b36eaa4f8666",
  measurementId: "G-ERZ5Z7KZVX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
