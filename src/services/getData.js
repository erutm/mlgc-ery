const { Firestore } = require('@google-cloud/firestore');

async function getData() {
  const db = new Firestore({
    projectId: 'submissionmlgc-eryutami',
    databaseId: 'mlgc'
  });
  
  const snapshot = await db.collection('predictions').get();

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

module.exports = getData;