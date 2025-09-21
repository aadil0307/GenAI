const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Import the createTestProducts function
const { createTestProducts } = require('../lib/products.ts');

// Firebase configuration (using environment variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

async function main() {
  try {
    console.log('Initializing Firebase...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Firebase initialized successfully!');
    console.log('Creating test products...\n');
    
    // Create test products
    await createTestProducts();
    
    console.log('\n✅ All test products created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test products:', error);
    process.exit(1);
  }
}

main();
