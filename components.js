// components.js - Reusable UI Components
import { auth, fmtN } from './firebase-config.js';

/**
 * Renders the primary Sidebar or Bottom Nav responsively
 */
export function injectNavigation(activeId = "") {
  const sidebar = document.getElementById('sidebar-target');
  const bottomNav = document.getElementById('bottom-nav-target');

  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: 'fa-house', url: 'dashboard.html' },
    { id: 'deposit', label: 'Add Funds', icon: 'fa-wallet', url: 'deposit.html' },
    { id: 'invest', label: 'Invest', icon: 'fa-chart-line', url: 'invest.html' },
    { id: 'withdraw', label: 'Withdraw', icon: 'fa-bank', url: 'withdraw.html' },
    { id: 'code', label: 'Get Code', icon: 'fa-key', url: 'buy-code.html' },
    { id: 'support', label: 'Support', icon: 'fa-headset', url: 'support.html' },
    { id: 'profile', label: 'Profile', icon: 'fa-user-circle', url: 'profile.html' }
  ];

  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-inner">
        <div class="brand-logo" style="padding: var(--s8) var(--s6);">
           <div class="logo-box" style="width:40px; height:40px; background:var(--blue); border-radius:10px; display:flex; align-items:center; justify-content:center; color:white; font-weight:900;">B</div>
           <span style="font-size:22px; font-weight:900; margin-left:12px;">BluePay</span>
        </div>
        <nav class="side-links">
          ${navItems.map(item => `
            <a href="${item.url}" class="nav-link ${activeId === item.id ? 'active' : ''}">
              <i class="fa-solid ${item.icon}"></i> <span>${item.label}</span>
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer" style="margin-top:auto; padding: var(--s6); border-top: 1px solid var(--border);">
          <button id="logout-btn" class="btn btn-outline" style="width:100%; color:var(--red); border-color:transparent;">
            <i class="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </div>
    `;
    document.getElementById('logout-btn')?.addEventListener('click', () => auth.signOut());
  }

  if (bottomNav) {
    bottomNav.innerHTML = navItems.slice(0, 5).map(item => `
      <a href="${item.url}" class="b-nav-item ${activeId === item.id ? 'active' : ''}">
        <i class="fa-solid ${item.icon}"></i>
        <small>${item.label}</small>
      </a>
    `).join('');
  }
}

/**
 * Toast System
 */
export function toast(msg, type = "info") {
  const box = document.getElementById('toast-box') || createToastBox();
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  el.innerHTML = `<i class="fa-solid ${icons[type]}"></i> <span>${msg}</span>`;
  box.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 4000);
}

function createToastBox() {
  const b = document.createElement('div');
  b.id = 'toast-box';
  document.body.appendChild(b);
  return b;
}

/**
 * Global Confirm Modal
 */
export function confirmAction(title, msg) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="card modal-card reveal revealed">
        <h3 class="mb-2">${title}</h3>
        <p class="mb-6">${msg}</p>
        <div class="flex-end gap-3">
          <button class="btn btn-outline py-2" id="modal-cancel">Cancel</button>
          <button class="btn btn-primary py-2" id="modal-ok">Proceed</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('modal-cancel').onclick = () => { overlay.remove(); resolve(false); };
    document.getElementById('modal-ok').onclick = () => { overlay.remove(); resolve(true); };
  });
}
