import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signOut,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC56JDJigGfULVKB2X5OLDfoJE0Y5UKzjQ',
  authDomain: 'studysync-4e62d.firebaseapp.com',
  projectId: 'studysync-4e62d',
  storageBucket: 'studysync-4e62d.firebasestorage.app',
  messagingSenderId: '952302491939',
  appId: '1:952302491939:web:eb898a5171a6aae9f61496',
  measurementId: 'G-TFEQJHMLNJ',
};

// Prevent duplicate app initialization during HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signOut,
  type User,
};
