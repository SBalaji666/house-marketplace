import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyANISurqQsV06JHoikIJPe8F4-TtI48SMY',
  authDomain: 'house-marketplace-app-1fb76.firebaseapp.com',
  projectId: 'house-marketplace-app-1fb76',
  storageBucket: 'house-marketplace-app-1fb76.appspot.com',
  messagingSenderId: '1077108855027',
  appId: '1:1077108855027:web:8b73dbb154442ff66be786',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
