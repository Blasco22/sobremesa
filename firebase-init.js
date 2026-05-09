// firebase-init.js · ES module that loads Firebase modular SDK and exposes it on window.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  onAuthStateChanged, signOut,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';
import {
  getFirestore, doc, setDoc, getDoc, deleteDoc, collection, onSnapshot, query, orderBy, serverTimestamp, writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import {
  getStorage, ref, uploadString, getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCdWC4htyyJC3b_V2LDnk_UbxzSHpWDvRk',
  authDomain: 'sobremesa-af74f.firebaseapp.com',
  projectId: 'sobremesa-af74f',
  storageBucket: 'sobremesa-af74f.firebasestorage.app',
  messagingSenderId: '1063107187004',
  appId: '1:1063107187004:web:ce96771d634d52ac9a0e39',
  measurementId: 'G-2HR754R5M2',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

window.FB = {
  auth, db, storage, googleProvider,
  signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut,
  doc, setDoc, getDoc, deleteDoc, collection, onSnapshot, query, orderBy, serverTimestamp, writeBatch,
  ref, uploadString, getDownloadURL,
};
window.dispatchEvent(new Event('fb-ready'));
