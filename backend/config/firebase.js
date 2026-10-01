const admin = require('firebase-admin');
const serviceAccount = require('../firebaseServiceAccount.json');

// Initialize Firebase Admin only if it hasn't been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'linear-axle-492009-h3.appspot.com' // Derived from project_id for standard storage setup
  });
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
