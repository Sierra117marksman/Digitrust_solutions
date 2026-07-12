import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || "adybabacrm";

if (!uri) {
  throw new Error("MONGODB_URI is not configured.");
}

const accounts = [
  {
    name: "Ajay Thakkar",
    email: "ajay81727@gmail.com",
    password: process.env.SEED_AJAY_PASSWORD,
    role: "main_developer",
    accessScope: "all_websites",
    permissions: ["*"],
  },
  {
    name: "Manisha Sharma",
    email: "moneysharma3997@gmail.com",
    password: process.env.SEED_MANISHA_PASSWORD,
    role: "manager",
    accessScope: "crm",
    permissions: [
      "leads:read",
      "leads:create",
      "leads:update",
      "leads:assign",
      "telecallers:read",
      "telecallers:create",
      "telecallers:update",
      "telecallers:manage",
      "reports:read",
    ],
  },
];

for (const account of accounts) {
  if (!account.password || account.password.length < 10) {
    throw new Error(`A valid seed password is required for ${account.email}.`);
  }
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const collection = client.db(databaseName).collection("admin_users");
  await collection.createIndex({ email: 1 }, { unique: true });

  for (const account of accounts) {
    const now = new Date();
    const passwordHash = await bcrypt.hash(account.password, 12);

    await collection.updateOne(
      { email: account.email.toLowerCase() },
      {
        $set: {
          name: account.name,
          email: account.email.toLowerCase(),
          passwordHash,
          role: account.role,
          accessScope: account.accessScope,
          permissions: account.permissions,
          status: "active",
          mustChangePassword: true,
          passwordChangedAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
          createdBy: "initial_setup",
          authVersion: 1,
        },
      },
      { upsert: true },
    );

    console.log(`Seeded ${account.name} (${account.role})`);
  }
} finally {
  await client.close();
}
