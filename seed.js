// One-off script: inserts the starting lessons into the "lessons" collection if it is empty.
require("dotenv").config({ path: "./config.env" });
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_PREFIX + process.env.MONGODB_USERNAME + ":" +
  process.env.MONGODB_PASSWORD + process.env.MONGODB_URL;
const client = new MongoClient(uri);

const lessons = [
  { id: 1001, subject: "Computer Science", location: "Hendon", price: 120, availability: 5,
    image: "images/computerScience.svg", alt: "A computer screen showing code" },
  { id: 1002, subject: "Maths", location: "Colindale", price: 80, availability: 5,
    image: "images/math.svg", alt: "Maths sigma symbol" },
  { id: 1003, subject: "Art", location: "Brent Cross", price: 90, availability: 5,
    image: "images/art.svg", alt: "A pencil for art class" },
  { id: 1004, subject: "Music", location: "Golders Green", price: 95, availability: 5,
    image: "images/music.svg", alt: "A musical note" }
];

async function seed() {
  try {
    await client.connect();
    const collection = client.db(process.env.DB_NAME || "AfterClass").collection("lessons");
    if (await collection.countDocuments() > 0) {
      console.log("lessons collection already has data, nothing inserted");
    } else {
      const result = await collection.insertMany(lessons);
      console.log("Inserted " + result.insertedCount + " lessons");
    }
    await client.db(process.env.DB_NAME || "AfterClass").createCollection("orders").catch(() => {});
  } finally {
    await client.close();
  }
}
seed();
