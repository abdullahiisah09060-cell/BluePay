import { auth, db, getUserData } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged,
  sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

export const handleRegistration = async (email, password, fullName, phone, refCode = null) => {
  // Check for duplicate BEFORE creating auth account
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const snap = await getDocs(q);

  if (!snap.empty) {
    throw new Error("An account with this email already exists. Please login.");
  }

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  const isAdmin = email === "liger4683@gmail.com";
  
  const userData = {
    uid: user.uid,
    email,
    displayName: fullName,
    phone,
    balance: 0,
    totalDeposited: 0,
    totalInvested: 0,
    totalWithdrawn: 0,
    totalEarned: 0,
    role: isAdmin ? "admin" : "user",
    authProviders: ["password"],
    kycStatus: "not_submitted",
    welcomeBonusPaid: true,
    createdAt: serverTimestamp(),
    referralCode: Math.random().toString(36).substring(2, 8).toUpperCase()
  };

  await setDoc(doc(db, "users", user.uid), userData);
  await sendEmailVerification(user);
  
  // Credit Welcome Bonus (e.g., 500 NGN)
  await updateDoc(doc(db, "users", user.uid), { balance: increment(500) });
  
  return user;
};

export const handleGoogleSignIn = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  const existingDoc = await getUserData(user.uid);
  
  if (!existingDoc) {
    // Check if email exists under different provider
    const q = query(collection(db, "users"), where("email", "==", user.email));
    const snap = await getDocs(q);

    if (!snap.empty) {
      // Link to existing document
      const docId = snap.docs[0].id;
      await updateDoc(doc(db, "users", docId), {
        authProviders: arrayUnion("google.com")
      });
      return;
    }

    // New User
    const isAdmin = user.email === "liger4683@gmail.com";
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: isAdmin ? "admin" : "user",
      balance: 500, // Welcome bonus
      authProviders: ["google.com"],
      createdAt: serverTimestamp()
    });
  }
};
