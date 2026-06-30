export const showToast = (message, type = 'success', duration = 3000) => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
};

export const renderGoogleButton = (containerId, text = "Continue with Google") => {
  const btn = document.createElement('button');
  btn.className = 'btn-google';
  btn.style.cssText = `
    width: 100%; height: 48px; background: white; color: #1f2937;
    border: 1px solid #e5e7eb; border-radius: 8px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    cursor: pointer; margin-bottom: 20px; transition: 0.2s;
  `;
  btn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    ${text}
  `;
  document.getElementById(containerId).appendChild(btn);
  return btn;
};

export const renderSidebar = (active) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout' },
    { id: 'invest', label: 'Invest', icon: 'trending-up' },
    { id: 'withdraw', label: 'Withdraw', icon: 'arrow-down-circle' },
    { id: 'referrals', label: 'Referrals', icon: 'users' },
    { id: 'support', label: 'Support', icon: 'message-circle' }
  ];
  // Logic to inject into a <nav id="sidebar">
};

export const showConfirmModal = (title, message, onConfirm) => {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.8);
    display: flex; align-items: center; justify-content: center; z-index: 10000;
  `;
  modal.innerHTML = `
    <div class="card" style="width: 90%; max-width: 400px; text-align: center;">
      <h3 class="text-h3" style="margin-bottom: 12px;">${title}</h3>
      <p class="text-body" style="margin-bottom: 24px;">${message}</p>
      <div style="display: flex; gap: 12px;">
        <button class="btn btn-outline" id="modal-cancel" style="flex: 1;">Cancel</button>
        <button class="btn btn-primary" id="modal-confirm" style="flex: 1;">Confirm</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#modal-confirm').onclick = () => { onConfirm(); modal.remove(); };
  modal.querySelector('#modal-cancel').onclick = () => modal.remove();
};
