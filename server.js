var express = require("express");
var cors = require("cors");
var path = require("path");
var app = express();

var lessons = [
  { id: 1001, subject: "Computer Science", location: "Hendon", price: 120, availability: 5,
    image: "images/computerScience.svg", alt: "A computer screen showing code" },
  { id: 1002, subject: "Maths", location: "Colindale", price: 80, availability: 5,
    image: "images/math.svg", alt: "Maths sigma symbol" },
  { id: 1003, subject: "Art", location: "Brent Cross", price: 90, availability: 5,
    image: "images/art.svg", alt: "A pencil for art class" },
  { id: 1004, subject: "Music", location: "Golders Green", price: 95, availability: 5,
    image: "images/music.svg", alt: "A musical note" }
];

app.use(cors());

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

app.get("/lessons", function(request, response) {
  response.json(lessons);
});

app.use(function(request, response) {
  response.status(404).send("Page Not Found!");
});

app.listen(3000, function() {
  console.log("App started on port 3000");
});
