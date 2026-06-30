// auth.js
import { auth, db, COL, CONSTANTS } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDoc, doc, setDoc, updateDoc, serverTimestamp, query, collection, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { toast } from './components.js';

export async function syncUserDoc(user, additionalData = {}) {
  const userRef = doc(db, COL.USERS, user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // DUPLICATE PREVENTION: Check if email exists under different UID
    const q = query(collection(db, COL.USERS), where("email", "==", user.email));
    const querySnap = await getDocs(q);
    
    if (!querySnap.empty) {
      toast("This email is already associated with another account.", "error");
      await auth.signOut();
      return null;
    }

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: additionalData.displayName || user.displayName || "BluePay Investor",
      phone: additionalData.phone || "",
      photoURL: user.photoURL || "",
      role: user.email === CONSTANTS.ADMIN_EMAIL ? "admin" : "user", // AUTO-ADMIN ASSIGNMENT
      balance: CONSTANTS.WELCOME_BONUS,
      totalInvested: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      referredBy: additionalData.referredBy || "",
      referralCount: 0,
      referralEarnings: 0,
      kycStatus: "not_submitted",
      authProviders: user.providerData.map(p => p.providerId),
      isActive: true,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp()
    };

    await setDoc(userRef, userData);
    return userData;
  } else {
    await updateDoc(userRef, { lastSeen: serverTimestamp() });
    return snap.data();
  }
}

export function handleAuthGuard(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      if (!["index.html", "login.html", "register.html", "forgot-password.html"].includes(window.location.pathname.split('/').pop())) {
        window.location.href = "login.html";
      }
      return;
    }
    const userData = await syncUserDoc(user);
    if (userData) callback(user, userData);
  });
}
