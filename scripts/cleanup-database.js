const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

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

async function clearCollection(collectionName) {
  console.log(`\n🗑️  Clearing ${collectionName} collection...`);

  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    console.log(`Found ${querySnapshot.size} documents in ${collectionName}`);

    let deleteCount = 0;
    const deletePromises = [];

    querySnapshot.forEach((document) => {
      deletePromises.push(
        deleteDoc(doc(db, collectionName, document.id))
          .then(() => {
            deleteCount++;
            console.log(`  ✓ Deleted ${collectionName}/${document.id}`);
          })
          .catch((error) => {
            console.error(`  ✗ Failed to delete ${document.id}:`, error.message);
          })
      );
    });

    await Promise.all(deletePromises);
    console.log(`✅ Successfully deleted ${deleteCount} documents from ${collectionName}`);
    return deleteCount;
  } catch (error) {
    console.error(`❌ Error clearing ${collectionName}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting database cleanup...\n');
  console.log('⚠️  This will delete:');
  console.log('   - All requests');
  console.log('   - All users (sellers and buyers)');
  console.log('   - All trips');

  try {
    // Clear requests
    await clearCollection('requests');

    // Clear users
    await clearCollection('users');

    // Clear trips
    await clearCollection('trips');

    console.log('\n🎉 Database cleanup complete!');
    console.log('You can now test the signup and profile completion flow from scratch.');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Cleanup failed:', error);
    process.exit(1);
  }
}

main();
