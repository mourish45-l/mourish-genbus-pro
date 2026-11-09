// Firebase Cloud Messaging Service Worker for Mourish GenBus
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB81Z2c6rcs26lMY058-XrdZuz83Rpz9Ao",
  authDomain: "mourish-genbus.firebaseapp.com",
  databaseURL: "https://mourish-genbus-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mourish-genbus",
  storageBucket: "mourish-genbus.firebasestorage.app",
  messagingSenderId: "197392397360",
  appId: "1:197392397360:web:d6f64e781f53553a4869f5",
  measurementId: "G-PLV0LGV7ZV"
};

firebase.initializeApp(firebaseConfig);

let messaging;
try {
  messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);
    const notificationTitle = payload.notification?.title || payload.data?.title || 'Mourish GenBus ERP Alert';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'New operational update received.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.warn('[firebase-messaging-sw.js] Messaging init failed or not supported in this context', e);
}
