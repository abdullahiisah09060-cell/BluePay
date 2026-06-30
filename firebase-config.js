import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, 
  signInWithPopup, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, doc, setDoc, getDoc, updateDoc, collection, 
  query, where, getDocs, orderBy, onSnapshot, runTransaction, 
  serverTimestamp, increment, writeBatch 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJlOQ4vgvuJPzE6ZG56aFxAtX0PSxvOtI",
  authDomain: "apexvault-investment.firebaseapp.com",
  projectId: "apexvault-investment",
  storageBucket: "apexvault-investment.firebasestorage.app",
  messagingSenderId: "884037084154",
  appId: "1:884037084154:web:b9ca0de1293527d38afa43"
};

// Initialize
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// PLATFORM CONSTANTS
export const COL = {
  USERS: "users",
  TX: "transactions",
  INV: "investments",
  WDL: "withdrawals",
  CODES: "codes",
  NOTIF: "notifications",
  KYC: "kyc",
  SUPPORT: "support",
  SETTINGS: "settings"
};

export const CODE_PRICE = 10000; // Fixed ₦10,000 per WDC
export const ADMIN_EMAIL = "liger4683@gmail.com";

/**
 * 1. DUPLICATE ACCOUNT PREVENTION & USER CREATION
 * logic: Check if email exists in Firestore before creating a new doc.
 */
export async function syncUserAccount(user, extraData = {}) {
  const userRef = doc(db, COL.USERS, user.uid);
  const emailQuery = query(collection(db, COL.USERS), where("email", "==", user.email));
  const querySnap = await getDocs(emailQuery);

  // If a document with this email exists but with a different UID
  if (!querySnap.empty && querySnap.docs[0].id !== user.uid) {
    throw new Error(`An account with ${user.email} already exists. Please sign in with your original method.`);
  }

  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) {
    // New User Logic
    const role = user.email === ADMIN_EMAIL ? "admin" : "user";
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || extraData.displayName || "BluePay Investor",
      phone: extraData.phone || "",
      balance: 0, 
      totalInvested: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      referralCode: generateRefCode(),
      referredBy: extraData.referredBy || "",
      kycStatus: "not_submitted",
      role: role,
      isActive: true,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      authProviders: user.providerData.map(p => p.providerId)
    };
    await setDoc(userRef, userData);
    
    // Add Welcome Notification
    await notifyUser(user.uid, "Welcome to BluePay!", "Your account has been secured. Fund your wallet to start earning daily returns.", "success");
    return userData;
  } else {
    // Existing User: Update last seen and auth providers
    const providers = docSnap.data().authProviders || [];
    const newProvider = user.providerData[0].providerId;
    if (!providers.includes(newProvider)) providers.push(newProvider);
    
    await updateDoc(userRef, { 
      lastSeen: serverTimestamp(),
      authProviders: providers 
    });
    return docSnap.data();
  }
}

/**
 * 2. WITHDRAWAL CODE SYSTEM (CRYPTO SECURE)
 */
export async function generateWithdrawalCode(uid, paystackRef) {
  // Generate Cryptographically Strong Code
  const array = new Uint8Array(5);
  window.crypto.getRandomValues(array);
  const codeSuffix = Array.from(array, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const fullCode = `WDC-${codeSuffix}`;

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const codeData = {
    uid,
    code: fullCode,
    price: CODE_PRICE,
    paystackRef,
    used: false,
    expiresAt,
    createdAt: serverTimestamp()
  };

  await setDoc(doc(collection(db, COL.CODES)), codeData);
  return fullCode;
}

/**
 * 3. ATOMIC FINANCIAL OPERATIONS
 */
export async function creditUserBalance(uid, amount, txType, description, meta = {}) {
  const userRef = doc(db, COL.USERS, uid);
  const txRef = doc(collection(db, COL.TX));
  
  const batch = writeBatch(db);
  batch.update(userRef, { 
    balance: increment(amount),
    totalEarned: (txType === 'payout' || txType === 'referral') ? increment(amount) : increment(0)
  });
  batch.set(txRef, {
    uid, amount, type: txType, description, status: "completed", meta, createdAt: serverTimestamp()
  });
  await batch.commit();
}

export async function debitUserBalance(uid, amount, txType, description, meta = {}) {
  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(doc(db, COL.USERS, uid));
    if (!userSnap.exists()) throw "User not found";
    if (userSnap.data().balance < amount) throw "Insufficient funds";

    transaction.update(doc(db, COL.USERS, uid), {
      balance: increment(-amount)
    });
    transaction.set(doc(collection(db, COL.TX)), {
      uid, amount, type: txType, description, status: "completed", meta, createdAt: serverTimestamp()
    });
  });
}

// Helpers
function generateRefCode() { return Math.random().toString(36).substring(2, 8).toUpperCase(); }
export async function notifyUser(uid, title, message, type) {
  await setDoc(doc(collection(db, COL.NOTIF)), { uid, title, message, type, read: false, createdAt: serverTimestamp() });
}

export const fmtN = (v) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(v);
