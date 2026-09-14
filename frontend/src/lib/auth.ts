import { supabase } from './supabaseClient';

export interface UserSession {
  id: string;
  email: string;
  name: string;
}

const USER_STORAGE_KEY = 'resumai_user_session';

export function getStoredUser(): UserSession {
  if (typeof window === 'undefined') {
    return { id: 'user_' + Date.now(), email: 'candidate@example.com', name: 'New Candidate' };
  }
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
  }
  // Default dynamic guest session if none exists
  const newSession = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    email: 'user@example.com',
    name: 'Candidate User'
  };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newSession));
  return newSession;
}

export function setStoredUser(user: UserSession) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}
