// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Platform Constants
export const COL = {
  USERS: "users",
  TX: "transactions",
  WITHDRAWALS: "withdrawals",
  DEPOSITS: "deposits",
  INVESTMENTS: "investments",
  CODES: "codes",
  NOTIFS: "notifications",
  KYC: "kyc",
  SUPPORT: "support"
};

export const CONSTANTS = {
  WITHDRAWAL_CODE_PRICE: 10000,
  WELCOME_BONUS: 200000,
  REFERRAL_BONUS: 2000,
  ADMIN_EMAIL: "liger4683@gmail.com"
};

// Formatting Utilities
export const fmtN = (v) => "₦" + Number(v).toLocaleString('en-NG', { minimumFractionDigits: 2 });
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
