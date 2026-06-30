// auth.js - BluePay Robust Authentication Handler
import { auth, syncUserDoc, googleProvider, PLATFORM } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  sendEmailVerification, signInWithPopup, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { toast } from "./app.js";

export function handleAuthError(code) {
  switch (code) {
    case "auth/email-already-in-use": return "This email is already registered. Try logging in.";
    case "auth/wrong-password": return "Incorrect password. Please try again.";
    case "auth/user-not-found": return "No account found with this email.";
    case "duplicate_email_detected": return "This email is already linked to another login method.";
    default: return "An authentication error occurred. Please try again.";
  }
}

// Global Auth Guard
export function initAuthGuard(type = "user") {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const userData = await syncUserDoc(user);
    
    if (type === "admin" && userData.role !== "admin") {
      window.location.href = "dashboard.html";
    }

    if (!user.emailVerified && user.providerData[0].providerId === 'password') {
      window.location.href = "verify.html";
    }
  });
}

// UI Helpers
export function setBtnLoading(btn, isLoading, originalText) {
  btn.disabled = isLoading;
  btn.innerHTML = isLoading ? `<i class="fa-solid fa-spinner fa-spin"></i> Processing...` : originalText;
}
