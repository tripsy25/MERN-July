import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAXd3Mbjv_eOt02azDREm28zV1c2Phgi3M",
  authDomain: "mern-stack-ac7ac.firebaseapp.com",
  projectId: "mern-stack-ac7ac",
  storageBucket: "mern-stack-ac7ac.firebasestorage.app",
  messagingSenderId: "544902131706",
  appId: "1:544902131706:web:3cde9d56089644e19ffe43",
  measurementId: "G-36T97YS5RM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
