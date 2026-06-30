import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-EXAMPLE-KEY",
  authDomain: "bluepay-nigeria.firebaseapp.com",
  projectId: "bluepay-nigeria",
  storageBucket: "bluepay-nigeria.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- DB HELPERS ---
export const getUserData = async (uid) => {
  const d = await getDoc(doc(db, "users", uid));
  return d.exists() ? d.data() : null;
};

export const updateBalance = async (uid, amount, type = 'add') => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { 
    balance: increment(type === 'add' ? amount : -amount),
    updatedAt: serverTimestamp()
  });
};

export const createTransaction = async (data) => {
  await addDoc(collection(db, "transactions"), {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const formatNaira = (amt) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amt);
};

// --- AUTH GUARDS ---
export const requireAuth = (callback) => {
  auth.onAuthStateChanged(user => {
    if (!user) window.location.href = "login.html";
    else callback(user);
  });
};
