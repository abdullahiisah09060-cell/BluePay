// firebase-config.js - BluePay High-Integrity Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, collection, 
  query, where, getDocs, runTransaction, serverTimestamp, 
  orderBy, onSnapshot, limit, writeBatch, increment
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
export const COL = {
  USERS: "users",
  TX: "transactions",
  WITHDRAWALS: "withdrawals",
  DEPOSITS: "deposits",
  INVESTMENTS: "investments",
  CODES: "codes",
  NOTIFS: "notifications",
  KYC: "kyc",
  SUPPORT: "support",
  SETTINGS: "settings"
};

export const PLATFORM = {
  WELCOME_BONUS: 200000,
  REFERRAL_BONUS: 2000,
  WITHDRAWAL_CODE_PRICE: 10000,
  ADMIN_EMAIL: "liger4683@gmail.com",
  MIN_DEPOSIT: 1000,
  MIN_WITHDRAWAL: 2000
};

// INVESTMENT PLAN DATA
export const PLANS = [
  { id: "nano", name: "Nano", roi: 10, days: 3, min: 1000, max: 4999 },
  { id: "starter", name: "Starter", roi: 15, days: 7, min: 5000, max: 19999 },
  { id: "bronze", name: "Bronze", roi: 20, days: 7, min: 10000, max: 49999 },
  { id: "silver", name: "Silver", roi: 28, days: 14, min: 20000, max: 99999 },
  { id: "gold", name: "Gold", roi: 35, days: 14, min: 50000, max: 199999 },
  { id: "diamond", name: "Diamond", roi: 45, days: 21, min: 100000, max: 499999 },
  { id: "platinum", name: "Platinum", roi: 60, days: 30, min: 200000, max: 999999 },
  { id: "elite", name: "Elite", roi: 75, days: 30, min: 500000, max: 1999999 },
  { id: "vip", name: "VIP", roi: 90, days: 45, min: 1000000, max: 4999999 },
  { id: "apex", name: "APEX", roi: 120, days: 60, min: 5000000, max: 50000000 }
];

// --- AUTHENTICATION & USER GROWTH ---

/**
 * Creates/Syncs Firestore User Document
 * Logic: Prevents duplicates, handles provider linking metadata, and auto-assigns admin.
 */
export async function syncUserDoc(user, additionalData = {}) {
  const userRef = doc(db, COL.USERS, user.uid);
  const snap = await getDoc(userRef);
  
  if (!snap.exists()) {
    // Check if email already exists under different UID (Duplicate Prevention)
    const q = query(collection(db, COL.USERS), where("email", "==", user.email));
    const existingEmailSnap = await getDocs(q);
    if (!existingEmailSnap.empty) {
      throw new Error("duplicate_email_detected");
    }

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: additionalData.displayName || user.displayName || "New Investor",
      phone: additionalData.phone || "",
      photoURL: user.photoURL || "",
      role: user.email === PLATFORM.ADMIN_EMAIL ? "admin" : "user",
      balance: PLATFORM.WELCOME_BONUS,
      totalInvested: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      referredBy: additionalData.referredBy || "",
      referralCount: 0,
      kycStatus: "not_submitted",
      authProviders: user.providerData.map(p => p.providerId),
      isActive: true,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp()
    };

    await setDoc(userRef, userData);
    await logTransaction(user.uid, PLATFORM.WELCOME_BONUS, "bonus", "Signup Welcome Bonus", "completed");
    await sendNotification(user.uid, "Welcome to BluePay!", `Your ₦${PLATFORM.WELCOME_BONUS.toLocaleString()} signup bonus has been credited.`, "success");
    
    if (userData.referredBy) {
      await handleReferralBonus(userData.referredBy, user.uid);
    }
    return userData;
  } else {
    // Update existing user last seen
    await updateDoc(userRef, { lastSeen: serverTimestamp() });
    return snap.data();
  }
}

// --- FINANCIAL SYSTEM (ATOMIC) ---

export async function logTransaction(uid, amount, type, desc, status = "pending", meta = {}) {
  const txRef = doc(collection(db, COL.TX));
  const txData = {
    uid, amount, type, desc, status, meta,
    createdAt: serverTimestamp()
  };
  await setDoc(txRef, txData);
  return txRef.id;
}

export async function sendNotification(uid, title, msg, type = "info") {
  const notifRef = doc(collection(db, COL.NOTIFS));
  await setDoc(notifRef, {
    uid, title, msg, type, read: false, createdAt: serverTimestamp()
  });
}

/**
 * Withdrawal Code Generation
 * Cryptographically secure 10-character code
 */
export function generateSecureCode() {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars
  let code = "WDC-";
  const randomValues = new Uint32Array(10);
  window.crypto.getRandomValues(randomValues);
  for (let i = 0; i < 10; i++) {
    code += charset[randomValues[i] % charset.length];
  }
  return code;
}

/**
 * Atomic Balance Credit
 */
export async function creditUserBalance(uid, amount, type, desc, meta = {}) {
  const userRef = doc(db, COL.USERS, uid);
  await runTransaction(db, async (ts) => {
    const userSnap = await ts.get(userRef);
    if (!userSnap.exists()) throw "User not found";
    const currentBal = userSnap.data().balance || 0;
    ts.update(userRef, { balance: currentBal + amount });
  });
  await logTransaction(uid, amount, type, desc, "completed", meta);
}

// --- FORMATTING UTILS ---
export const fmtN = (v) => "₦" + Number(v).toLocaleString("en-NG", { minimumFractionDigits: 2 });
export const timeAgo = (date) => {
  if (!date) return "...";
  const seconds = Math.floor((new Date() - date.toDate()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
};
