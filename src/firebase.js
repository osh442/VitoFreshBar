// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiypDUUIfO3BnriHv_KwedFtxdk7CIfzM",
  authDomain: "fresha-9db1e.firebaseapp.com",
  projectId: "fresha-9db1e",
  storageBucket: "fresha-9db1e.firebasestorage.app",
  messagingSenderId: "22548794236",
  appId: "1:22548794236:web:c1f48ddadadc0c0aca32f9",
  measurementId: "G-K3C8V4DCFN"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
