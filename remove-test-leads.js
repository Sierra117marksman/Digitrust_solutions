const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "adybabacrm";

async function removeTest() {
  if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const leadsCollection = db.collection('website_enquiries');

    const result = await leadsCollection.deleteMany({ isTest: true });
    console.log(`Successfully removed ${result.deletedCount} test leads.`);

  } catch (error) {
    console.error("Error removing test leads:", error);
  } finally {
    await client.close();
  }
}

removeTest();
