import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: 'meetsmart-360014.firebaseapp.com',
  projectId: 'meetsmart-360014',
  storageBucket: 'meetsmart-360014.appspot.com',
  messagingSenderId: '277756892625',
  appId: '1:277756892625:web:9758c0e665da605bf43cf0',
  measurementId: 'G-T5MKNY6Q6K',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const database = getFirestore(app);
