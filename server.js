var express = require("express");
var cors = require("cors");
var path = require("path");
require("dotenv").config({ path: "./config.env" });

// MongoDB connection setup (credentials come from environment variables)
const { MongoClient, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_PREFIX +
  process.env.MONGODB_USERNAME + ":" +
  process.env.MONGODB_PASSWORD +
  process.env.MONGODB_URL;
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME || "AfterClass");

var app = express();

app.use(cors());
app.use(express.json());

// Logger middleware: runs for every request, logs time, method and url, then passes on
app.use(function(request, response, next) {
  console.log("[" + new Date().toISOString() + "] " + request.method + " " + request.url);
  next();
});

// Static file middleware: serves lesson images from the images folder
app.use("/images", express.static(path.resolve(__dirname, "images")));

// Reached only if express.static did not find the file
app.use("/images", function(request, response) {
  response.status(404).send("Image not found: " + request.url);
});

app.get("/lessons", async function(request, response) {
  let collection = await db.collection("lessons");
  let results = await collection.find({}).toArray();
  response.json(results);
});

app.post("/orders", async function(request, response) {
  var order = request.body;
  console.log("New order received: name=" + order.name + ", phone=" + order.phone +
    ", lessonIDs=[" + order.lessonIDs.join(", ") + "], spaces=" + order.spaces);
  let collection = await db.collection("orders");
  let result = await collection.insertOne(order);
  response.json(result);
});

// Updates any attributes of a lesson, e.g. { "availability": 3 }
app.put("/lessons/:_id", async function(request, response) {
  let collection = await db.collection("lessons");
  const query = { _id: new ObjectId(request.params._id) };
  const updates = { $set: request.body };
  let result = await collection.updateOne(query, updates);
  response.json(result);
});

app.use(function(request, response) {
  response.status(404).send("Page Not Found!");
});

app.listen(3000, function() {
  console.log("App started on port 3000");
});
