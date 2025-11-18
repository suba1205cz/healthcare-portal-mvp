// frontend/lib/auth.js
export function getStoredAuth() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('subaa_user');
    if (!raw) return null;
    return JSON.parse(raw); // { token, user: { id, name, email, role } }
  } catch {
    return null;
  }
}

export function setStoredAuth(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('subaa_user', JSON.stringify(data));
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('subaa_user');
}
