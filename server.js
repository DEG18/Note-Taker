// Dependencies
// =============================================================
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
// const { throws } = require("assert");

// Sets up the Express App
// =============================================================
var app = express();

var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Open the index.html "/" in folder public
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Open the notes.html "/notes" in folder public
app.get("/notes", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//- GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      const note = JSON.parse(data);
      res.json(note);
      // console.log(note);
    }
  });
});

//- POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file,
//  and then return the new note to the client.
app.post("/api/notes", async (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      let note = JSON.parse(data);
      req.body.id = note.length + 1;
      note.unshift(req.body);
      res.json(note);
      fs.writeFileSync("./db/db.json", JSON.stringify(note), "utf8");
      // console.log(note);
    }
  });
});

//- DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete.
//  This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note,
//  you'll need to read all notes from the `db.json` file, remove the note with the given `id` property,
//  and then rewrite the notes to the `db.json` file.

app.delete("/api/notes/:id", async (req, res) => {
  let id = req.params.id;
  console.log(id);
  let note = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  console.log(note);
  const newNote = note.filter(function (notesobj) {
    console.log(notesobj);
    console.log(notesobj.id);
    notesobj.id !== req.params.id;
  });
  fs.writeFileSync("./db/db.json", JSON.stringify(newNote));
  res.json(newNote);
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
