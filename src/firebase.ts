/**
 * Firebase Realtime Database & Authentication client setup
 * Configured for mourish-genbus on asia-southeast1 (Singapore)
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  onDisconnect
} from 'firebase/database';

import {
  getMessaging,
  getToken,
  onMessage,
  isSupported as isMessagingSupported,
  type Messaging
} from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: "AIzaSyB81Z2c6rcs26lMY058-XrdZuz83Rpz9Ao",
  authDomain: "mourish-genbus.firebaseapp.com",
  databaseURL: "https://mourish-genbus-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mourish-genbus",
  storageBucket: "mourish-genbus.firebasestorage.app",
  messagingSenderId: "197392397360",
  appId: "1:197392397360:web:d6f64e781f53553a4869f5",
  measurementId: "G-PLV0LGV7ZV"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Safe FCM Messaging initialization
let messagingInstance: Messaging | null = null;

export async function getFcmMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  if (messagingInstance) return messagingInstance;
  try {
    const supported = await isMessagingSupported();
    if (supported) {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    }
  } catch (err) {
    console.warn('[FCM] Messaging not supported or blocked in this browser environment:', err);
  }
  return null;
}

export async function requestFcmToken(): Promise<string | null> {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[FCM] Notification permission was denied or dismissed');
      return null;
    }

    const messaging = await getFcmMessaging();
    if (!messaging) return null;

    // Check service worker registration
    let swReg: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      } catch (swErr) {
        console.warn('[FCM] SW registration warning:', swErr);
      }
    }

    const token = await getToken(messaging, {
      serviceWorkerRegistration: swReg
    });
    return token;
  } catch (err) {
    console.warn('[FCM] Error requesting token:', err);
    return null;
  }
}

export async function subscribeToFcmMessages(
  callback: (payload: { title?: string; body?: string; data?: Record<string, string> }) => void
): Promise<(() => void) | null> {
  try {
    const messaging = await getFcmMessaging();
    if (!messaging) return null;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[FCM] Foreground notification received:', payload);
      callback({
        title: payload.notification?.title || payload.data?.title || 'Mourish GenBus Update',
        body: payload.notification?.body || payload.data?.body || 'New operational update received.',
        data: payload.data
      });
    });
    return unsubscribe;
  } catch (err) {
    console.warn('[FCM] Error subscribing to messages:', err);
    return null;
  }
}

export {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  onDisconnect,
  type User
};

