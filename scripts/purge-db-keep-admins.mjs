import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || "adybabacrm";
const keepEmails = ["ajay81727@gmail.com", "moneysharma3997@gmail.com"];

if (!uri) {
  throw new Error("MONGODB_URI is not configured.");
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(databaseName);
  const collections = await db.listCollections({}, { nameOnly: true }).toArray();
  const droppedCollections = [];

  for (const collection of collections) {
    if (collection.name === "admin_users" || collection.name.startsWith("system.")) {
      continue;
    }

    await db.collection(collection.name).drop();
    droppedCollections.push(collection.name);
  }

  const adminUsers = db.collection("admin_users");
  await adminUsers.createIndex({ email: 1 }, { unique: true });

  const removedExtraAdmins = await adminUsers.deleteMany({
    email: { $nin: keepEmails },
  });

  const remainingAdmins = await adminUsers
    .find(
      {},
      {
        projection: {
          _id: 0,
          name: 1,
          email: 1,
          role: 1,
          status: 1,
        },
      },
    )
    .sort({ email: 1 })
    .toArray();

  console.log(
    JSON.stringify(
      {
        database: db.databaseName,
        droppedCollections,
        removedExtraAdmins: removedExtraAdmins.deletedCount,
        remainingAdmins,
      },
      null,
      2,
    ),
  );
} finally {
  await client.close();
}
