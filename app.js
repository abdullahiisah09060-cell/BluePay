import { auth, getUserData } from "./firebase-config.js";
import { showToast } from "./components.js";

document.addEventListener('DOMContentLoaded', () => {
  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log("BluePay Service Worker Active"))
      .catch(err => console.error("SW Registration Failed", err));
  }

  // Global Auth Watcher
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const data = await getUserData(user.uid);
      if (data?.role === 'admin' && !window.location.pathname.includes('admin')) {
        // Optional: show admin portal floating button
      }
    }
  });
});

window.logout = () => {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
};
