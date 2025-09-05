// run once to create admin in DB: node scripts/create-admin.js username password
import "dotenv/config.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../src/models/Admin.js";

async function main() {
  const [,, username, password] = process.argv;
  if (!username || !password) { console.log("Usage: node scripts/create-admin.js <username> <password>"); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await Admin.create({ username, passwordHash });
  console.log("Admin created:", admin.username);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });