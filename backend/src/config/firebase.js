const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('../../firebaseServiceAccount.json');

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'linear-axle-492009-h3.appspot.com'
  });
}

const bucket = getStorage().bucket();

module.exports = { bucket };
