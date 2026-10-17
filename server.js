var express = require("express");
var cors = require("cors");
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

app.use(function(request, response) {
  console.log("In comes a request to: " + request.url);
  response.json(lessons);
});

app.listen(3000, function() {
  console.log("App started on port 3000");
});
