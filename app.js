import { auth, db, SETTINGS, fmtN } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * BlueUI Component Engine
 */
export const BlueUI = {
  // Toast Notification System
  toast: (msg, type = "info") => {
    const container = document.getElementById("toast-wrap") || (() => {
      const d = document.createElement("div"); d.id = "toast-wrap";
      d.style.cssText = "position:fixed; top:20px; right:20px; z-index:9999; display:grid; gap:10px;";
      document.body.appendChild(d); return d;
    })();
    
    const t = document.createElement("div");
    const colors = { success: "#22c55e", error: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };
    t.style.cssText = `background:#141928; color:#fff; padding:16px 24px; border-radius:10px; border-left:4px solid ${colors[type]}; 
                       box-shadow:0 10px 30px rgba(0,0,0,0.5); font-weight:600; font-size:14px; animation: slideIn 0.3s ease forwards;`;
    t.innerHTML = msg;
    container.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 500); }, 4000);
  },

  // Custom Confirmation Modal
  confirm: (title, text, confirmText = "Proceed") => {
    return new Promise((resolve) => {
      const m = document.createElement("div");
      m.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px);";
      m.innerHTML = `
        <div class="card" style="width:100%; max-width:400px; padding:30px; text-align:center;">
          <h3 style="margin-bottom:10px;">${title}</h3>
          <p style="margin-bottom:30px; font-size:14px; color:#8896aa;">${text}</p>
          <div style="display:flex; gap:10px;">
            <button id="m-can" class="btn btn-outline" style="flex:1">Cancel</button>
            <button id="m-con" class="btn btn-primary" style="flex:1">${confirmText}</button>
          </div>
        </div>
      `;
      document.body.appendChild(m);
      document.getElementById("m-can").onclick = () => { m.remove(); resolve(false); };
      document.getElementById("m-con").onclick = () => { m.remove(); resolve(true); };
    });
  },

  // Skeleton Loader Helper
  showSkeleton: (containerId, rows = 3) => {
    const cont = document.getElementById(containerId);
    if (!cont) return;
    cont.innerHTML = Array(rows).fill('<div class="skeleton" style="height:60px; margin-bottom:15px; border-radius:12px;"></div>').join('');
  }
};

/**
 * Authentication Guards & Layout Injection
 */
export function initAuth(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      if (window.location.pathname.includes("dashboard") || window.location.pathname.includes("admin")) {
        window.location.href = "login.html";
      }
    } else {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const userData = userSnap.data();
      
      // Admin Guard
      if (window.location.pathname.includes("admin") && userData.role !== "admin") {
        window.location.href = "dashboard.html";
        return;
      }

      injectLayout(userData);
      if (callback) callback(user, userData);
    }
  });
}

function injectLayout(user) {
  const sidebar = document.getElementById("sidebar-target");
  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-top">
        <div class="logo-area">
          <div class="logo-box">B</div>
          <span>${SETTINGS.SITE_NAME}</span>
        </div>
      </div>
      <nav class="side-nav">
        <a href="dashboard.html" class="${isActive('dashboard')}"><i class="fa-solid fa-house"></i> Dashboard</a>
        <a href="deposit.html" class="${isActive('deposit')}"><i class="fa-solid fa-wallet"></i> Fund Wallet</a>
        <a href="invest.html" class="${isActive('invest')}"><i class="fa-solid fa-chart-line"></i> Investments</a>
        <a href="withdraw.html" class="${isActive('withdraw')}"><i class="fa-solid fa-bank"></i> Withdraw</a>
        <a href="buy-code.html" class="${isActive('buy-code')}"><i class="fa-solid fa-key"></i> Security Code</a>
        <a href="referrals.html" class="${isActive('referrals')}"><i class="fa-solid fa-users"></i> Affiliates</a>
        <a href="support.html" class="${isActive('support')}"><i class="fa-solid fa-headset"></i> Support</a>
      </nav>
      <div class="sidebar-bottom">
        <button id="logout-btn" class="nav-item-logout"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
      </div>
    `;
    document.getElementById("logout-btn").onclick = () => signOut(auth);
  }
}

const isActive = (path) => window.location.pathname.includes(path) ? 'active' : '';
