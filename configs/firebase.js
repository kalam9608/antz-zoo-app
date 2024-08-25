import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBr139PrWxUsDzztmFSwABHBZ35MgsFOQQ",
  authDomain: "antzapp-6bc9a.firebaseapp.com",
  projectId: "antzapp-6bc9a",
  storageBucket: "antzapp-6bc9a.appspot.com",
  messagingSenderId: "116409476751",
  appId: "1:116409476751:web:968f8c0bc44ff44de932fa",
  measurementId: "G-1NH909GV7P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
