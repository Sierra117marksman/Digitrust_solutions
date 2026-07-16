import { MongoClient } from "mongodb";
import { generateTempPassword, hashPassword } from "./lib/password.js";

// We need to import from the compiled JS or just copy the logic here to avoid compilation issues.
// Since lib/password.ts is TS, I'll just write the logic here in JS.

import crypto from "crypto";
import bcrypt from "bcryptjs";

function getTempPassword(length = 16) {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const allChars = upperCase + lowerCase + numbers + symbols;
  let password = "";
  password += upperCase[crypto.randomInt(upperCase.length)];
  password += lowerCase[crypto.randomInt(lowerCase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += symbols[crypto.randomInt(symbols.length)];
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "adybabacrm";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    const tempPassword = getTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);
    
    await db.collection("admin_users").updateOne(
      { email: "moneysharma3997@gmail.com" },
      { $set: { passwordHash, mustResetPassword: true, authVersion: 2 } }
    );
    
    console.log("SUCCESS_PASSWORD=" + tempPassword);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
