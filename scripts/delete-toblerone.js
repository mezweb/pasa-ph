const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteToblerone() {
  console.log('🔍 Searching for Toblerone item...\n');

  try {
    // Query for Toblerone item
    const q = query(collection(db, 'requests'), where('title', '==', 'Toblerone'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('❌ No Toblerone item found');
      return;
    }

    console.log(`Found ${querySnapshot.size} Toblerone item(s)\n`);

    let deleteCount = 0;
    for (const document of querySnapshot.docs) {
      console.log(`  ✓ Deleting: ${document.id}`);
      console.log(`     Title: ${document.data().title}`);
      console.log(`     From: ${document.data().from}`);
      console.log(`     Price: ${document.data().price}`);

      await deleteDoc(doc(db, 'requests', document.id));
      deleteCount++;
      console.log(`  ✓ Deleted successfully!\n`);
    }

    console.log(`✅ Deleted ${deleteCount} Toblerone item(s)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting Toblerone:', error.message);
    process.exit(1);
  }
}

deleteToblerone();
