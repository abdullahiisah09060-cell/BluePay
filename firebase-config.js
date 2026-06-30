import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, collection, 
  query, where, getDocs, serverTimestamp, runTransaction, increment, writeBatch, onSnapshot, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJlOQ4vgvuJPzE6ZG56aFxAtX0PSxvOtI",
  authDomain: "apexvault-investment.firebaseapp.com",
  projectId: "apexvault-investment",
  storageBucket: "apexvault-investment.firebasestorage.app",
  messagingSenderId: "884037084154",
  appId: "1:884037084154:web:b9ca0de1293527d38afa43"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// PLATFORM CONSTANTS
export const SETTINGS = {
  SITE_NAME: "BluePay",
  ADMIN_EMAIL: "liger4683@gmail.com",
  WELCOME_BONUS: 200000,
  REFERRAL_BONUS: 2000,
  WITHDRAWAL_CODE_PRICE: 10000,
  CODE_EXPIRY_HOURS: 24
};

export const INVESTMENT_PLANS = [
  { id: "nano", name: "Nano", roi: 10, days: 3, min: 1000, max: 4999 },
  { id: "starter", name: "Starter", roi: 15, days: 7, min: 5000, max: 19999 },
  { id: "bronze", name: "Bronze", roi: 20, days: 7, min: 10000, max: 49999 },
  { id: "silver", name: "Silver", roi: 28, days: 14, min: 20000, max: 99999 },
  { id: "gold", name: "Gold", roi: 35, days: 14, min: 50000, max: 199999 },
  { id: "diamond", name: "Diamond", roi: 45, days: 21, min: 100000, max: 499999 },
  { id: "platinum", name: "Platinum", roi: 60, days: 30, min: 200000, max: 999999 },
  { id: "elite", name: "Elite", roi: 75, days: 30, min: 500000, max: 1999999 },
  { id: "vip", name: "VIP", roi: 90, days: 45, min: 1000000, max: 4999999 },
  { id: "apex", name: "APEX", roi: 120, days: 60, min: 5000000, max: Infinity }
];

// UTILITIES
export const fmtN = (amt) => "₦" + Number(amt || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });

/**
 * SECURE CODE GENERATOR
 * Uses Web Crypto API for high-entropy randomness
 */
export const generateSecureCode = () => {
  const array = new Uint8Array(5);
  crypto.getRandomValues(array);
  const hex = Array.from(array, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `WDC-${hex}`;
};

// DATABASE HELPERS
export async function createUserDoc(user, additionalData = {}) {
  const userRef = doc(db, "users", user.uid);
  
  // 1. Duplicate check by email
  const q = query(collection(db, "users"), where("email", "==", user.email));
  const snap = await getDocs(q);
  if (!snap.empty && snap.docs[0].id !== user.uid) {
    throw new Error("An account with this email already exists.");
  }

  const existing = await getDoc(userRef);
  if (existing.exists()) return existing.data();

  // 2. Auto-Admin logic
  const role = user.email === SETTINGS.ADMIN_EMAIL ? "admin" : "user";

  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: additionalData.displayName || user.displayName || "Investor",
    phone: additionalData.phone || "",
    balance: SETTINGS.WELCOME_BONUS,
    totalInvested: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    role: role,
    referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    referredBy: additionalData.referredBy || "",
    agentName: "Sarah Mitchell",
    kycStatus: "not_submitted",
    createdAt: serverTimestamp(),
    lastSeen: serverTimestamp()
  };

  await setDoc(userRef, userData);
  
  // Log Bonus
  await addDoc(collection(db, "transactions"), {
    uid: user.uid,
    type: "bonus",
    amount: SETTINGS.WELCOME_BONUS,
    description: "Welcome Bonus Credited",
    status: "completed",
    createdAt: serverTimestamp()
  });

  return userData;
}

// Financial Transaction Wrapper
export async function performTransaction(uid, amount, type, description, meta = {}) {
  const userRef = doc(db, "users", uid);
  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) throw "User not found";
    
    const balance = userSnap.data().balance;
    const isDebit = ["withdrawal", "investment"].includes(type);
    
    if (isDebit && balance < amount) throw "Insufficient wallet balance";

    const newBalance = isDebit ? balance - amount : balance + amount;
    const updates = { balance: newBalance };
    
    if (type === "investment") updates.totalInvested = increment(amount);
    if (type === "withdrawal") updates.totalWithdrawn = increment(amount);
    if (type === "return" || type === "referral_bonus") updates.totalEarned = increment(amount);

    transaction.update(userRef, updates);
    
    const txRef = doc(collection(db, "transactions"));
    transaction.set(txRef, {
      uid, type, amount, description, status: isDebit && type === "withdrawal" ? "pending" : "completed",
      meta, createdAt: serverTimestamp()
    });
  });
}
