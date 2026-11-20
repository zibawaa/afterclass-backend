// Task 9.7: exports every collection of the database to db-export/<collection>.json
// (MongoDB Extended JSON, the same style as Compass "Export the full collection").
require("dotenv").config({ path: "./config.env" });
const fs = require("fs");
const { MongoClient } = require("mongodb");
const { EJSON } = require("bson");

const uri = process.env.MONGODB_PREFIX + process.env.MONGODB_USERNAME + ":" +
  process.env.MONGODB_PASSWORD + process.env.MONGODB_URL;
const client = new MongoClient(uri);

async function exportDatabase() {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || "AfterClass");
    fs.mkdirSync("db-export", { recursive: true });
    for (const info of await db.listCollections().toArray()) {
      const documents = await db.collection(info.name).find({}).toArray();
      fs.writeFileSync("db-export/" + info.name + ".json", EJSON.stringify(documents, null, 2, { relaxed: false }));
      console.log("Exported " + documents.length + " documents from " + info.name);
    }
  } finally {
    await client.close();
  }
}
exportDatabase();
