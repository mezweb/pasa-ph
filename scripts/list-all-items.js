const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDu_L6kmckWN-TihfiDd_03t9vf-gDJMH0",
  authDomain: "pasabili-ph.firebaseapp.com",
  projectId: "pasabili-ph",
  storageBucket: "pasabili-ph.firebasestorage.app",
  messagingSenderId: "654997686934",
  appId: "1:654997686934:web:e02fb12a6fadd8ba31f1f8",
  measurementId: "G-ESRJNZ07RE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function listAllItems() {
  console.log('📋 Listing all items in database...\n');

  try {
    const querySnapshot = await getDocs(collection(db, 'requests'));

    if (querySnapshot.empty) {
      console.log('❌ No items found in database');
      process.exit(0);
    }

    console.log(`Found ${querySnapshot.size} item(s):\n`);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`  Title: ${data.title}`);
      console.log(`  From: ${data.from}`);
      console.log(`  To: ${data.to}`);
      console.log(`  Price: ${data.price}`);
      console.log(`  Category: ${data.category}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing items:', error.message);
    process.exit(1);
  }
}

listAllItems();
