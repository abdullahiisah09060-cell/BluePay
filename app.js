import { auth, COL, db, creditUserBalance, debitUserBalance } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * UI TOAST SYSTEM
 */
export function toast(msg, type = "info") {
  const box = document.createElement("div");
  box.className = `toast toast-${type}`;
  box.innerHTML = `<span>${msg}</span>`;
  document.body.appendChild(box);
  setTimeout(() => box.classList.add("show"), 100);
  setTimeout(() => {
    box.classList.remove("show");
    setTimeout(() => box.remove(), 500);
  }, 4000);
}

/**
 * REUSABLE CONFIRMATION MODAL (No native confirm())
 */
export function bConfirm(title, msg) {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "b-modal-overlay";
    modal.innerHTML = `
      <div class="b-modal-card">
        <h3>${title}</h3>
        <p>${msg}</p>
        <div class="b-modal-actions">
          <button id="b-cancel" class="btn-outline">Cancel</button>
          <button id="b-confirm" class="btn-primary">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#b-cancel").onclick = () => { modal.remove(); resolve(false); };
    modal.querySelector("#b-confirm").onclick = () => { modal.remove(); resolve(true); };
  });
}

/**
 * DYNAMIC SIDEBAR & BOTTOM NAV RENDERER
 */
export function renderNavigation(activePage, isAdmin = false) {
  const sidebar = document.getElementById("sidebar-nav");
  const bottomNav = document.getElementById("bottom-nav");
  
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'fa-house', link: 'dashboard.html' },
    { id: 'invest', label: 'Invest', icon: 'fa-chart-line', link: 'invest.html' },
    { id: 'withdraw', label: 'Withdraw', icon: 'fa-bank', link: 'withdraw.html' },
    { id: 'profile', label: 'Profile', icon: 'fa-user', link: 'profile.html' }
  ];

  if (sidebar) {
    sidebar.innerHTML = navItems.map(item => `
      <a href="${item.link}" class="nav-item ${activePage === item.id ? 'active' : ''}">
        <i class="fa-solid ${item.icon}"></i> <span>${item.label}</span>
      </a>
    `).join('') + (isAdmin ? `<a href="admin-dashboard.html" class="nav-item"><i class="fa-solid fa-crown"></i> Admin</a>` : '');
  }

  if (bottomNav) {
    bottomNav.innerHTML = navItems.map(item => `
      <a href="${item.link}" class="b-nav-item ${activePage === item.id ? 'active' : ''}">
        <i class="fa-solid ${item.icon}"></i> <span>${item.label}</span>
      </a>
    `).join('');
  }
}

// Global Auth Guard
export function initGuard(requireAdmin = false) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    const snap = await getDoc(doc(db, COL.USERS, user.uid));
    const userData = snap.data();
    
    if (requireAdmin && userData.role !== 'admin') {
      window.location.href = "dashboard.html";
      return;
    }
    // Globalize user data for page scripts
    window.currentUser = userData;
    if (window.onAppData) window.onAppData(userData);
  });
}

window.logout = async () => {
  if (await bConfirm("Logout", "Are you sure you want to exit your account?")) {
    await signOut(auth);
    window.location.href = "login.html";
  }
};
