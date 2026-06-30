// app.js - Global UI & Reusable Component Engine
import { auth, COL, db, sendNotification, fmtN } from "./firebase-config.js";
import { onSnapshot, query, collection, where, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  initGlobalUI();
});

function initGlobalUI() {
  // 1. Reveal Animation Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('revealed'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // 2. Clear loader
  const loader = document.getElementById('global-loader');
  if (loader) setTimeout(() => { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 500); }, 800);
}

/**
 * Reusable Sidebar/BottomNav Generator
 * Ensures all auth pages have the exact same UX
 */
export function injectNavigation(activePage = "") {
  const sidebar = document.getElementById('sidebar-inject');
  const bottomNav = document.getElementById('bottom-nav-inject');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-house', url: 'dashboard.html' },
    { id: 'deposit', label: 'Add Funds', icon: 'fa-wallet', url: 'deposit.html' },
    { id: 'invest', label: 'Investment', icon: 'fa-chart-line', url: 'invest.html' },
    { id: 'withdraw', label: 'Withdraw', icon: 'fa-bank', url: 'withdraw.html' },
    { id: 'buy-code', label: 'Security Code', icon: 'fa-key', url: 'buy-code.html' },
    { id: 'support', label: 'Support', icon: 'fa-headset', url: 'support.html' },
    { id: 'profile', label: 'Account', icon: 'fa-user-circle', url: 'profile.html' }
  ];

  if (sidebar) {
    sidebar.innerHTML = `
      <div class="sidebar-logo">
        <div class="logo-box"><i class="fa-solid fa-b"></i></div>
        <span>BluePay</span>
      </div>
      <nav class="sidebar-nav">
        ${navItems.map(item => `
          <a href="${item.url}" class="nav-item ${activePage === item.id ? 'active' : ''}">
            <i class="fa-solid ${item.icon}"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <a href="#" class="nav-item text-red" id="logout-trigger">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Secure Logout</span>
        </a>
      </div>
    `;
    document.getElementById('logout-trigger')?.addEventListener('click', () => auth.signOut());
  }

  if (bottomNav) {
    bottomNav.innerHTML = navItems.slice(0, 5).map(item => `
      <a href="${item.url}" class="b-nav-item ${activePage === item.id ? 'active' : ''}">
        <i class="fa-solid ${item.icon}"></i>
        <span>${item.label}</span>
      </a>
    `).join('');
  }
}

/**
 * Modern Toast System
 */
export function toast(msg, type = "info") {
  const container = document.getElementById('toast-box') || createToastBox();
  const t = document.createElement('div');
  t.className = `toast-item toast-${type}`;
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
  t.innerHTML = `<i class="fa-solid ${icons[type]}"></i> <span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4000);
}

function createToastBox() {
  const b = document.createElement('div');
  b.id = 'toast-box';
  document.body.appendChild(b);
  return b;
}

/**
 * Custom Promise-based Confirmation Modal
 * Replaces native confirm()
 */
export function confirmAction(title, message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'confirm-overlay';
    modal.innerHTML = `
      <div class="confirm-card reveal revealed">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="confirm-btns">
          <button class="btn btn-outline" id="confirm-no">Cancel</button>
          <button class="btn btn-primary" id="confirm-yes">Proceed</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('confirm-no').onclick = () => { modal.remove(); resolve(false); };
    document.getElementById('confirm-yes').onclick = () => { modal.remove(); resolve(true); };
  });
}

export async function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 2 * 1024 * 1024) return reject("File size exceeds 2MB limit.");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = e => reject(e);
  });
}
