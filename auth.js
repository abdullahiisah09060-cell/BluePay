import { auth, createUserDoc, googleProvider, BlueUI } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const AuthEngine = {
  // Register with Email
  register: async (email, password, displayName, phone, referredBy) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDoc(cred.user, { displayName, phone, referredBy });
      await sendEmailVerification(cred.user);
      return { success: true };
    } catch (err) {
      AuthEngine.handleError(err);
    }
  },

  // Login with Email
  login: async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        BlueUI.toast("Please verify your email to access the dashboard.", "warning");
        await sendEmailVerification(cred.user);
        return { unverified: true };
      }
      return { success: true };
    } catch (err) {
      AuthEngine.handleError(err);
    }
  },

  // Google Provider
  continueWithGoogle: async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await createUserDoc(res.user);
      window.location.href = "dashboard.html";
    } catch (err) {
      AuthEngine.handleError(err);
    }
  },

  handleError: (err) => {
    let msg = "An authentication error occurred.";
    if (err.code === "auth/email-already-in-use") msg = "This email is already registered.";
    if (err.code === "auth/wrong-password") msg = "Incorrect password.";
    if (err.code === "auth/user-not-found") msg = "No account found with this email.";
    BlueUI.toast(msg, "error");
    console.error(err);
  }
};
