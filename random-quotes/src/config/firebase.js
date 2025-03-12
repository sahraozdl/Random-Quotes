import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3pYz9y_E9K1s_lMTh9UisbEU016lKK64",
  authDomain: "quote-generator-d1024.firebaseapp.com",
  projectId: "quote-generator-d1024",
  storageBucket: "quote-generator-d1024.firebasestorage.app",
  messagingSenderId: "150645397069",
  appId: "1:150645397069:web:370a743d4f8393d212ae04",
  measurementId: "G-2YZWW9YEZ1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);