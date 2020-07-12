const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(express.static('public'));
const notes  = require('./db/db.json');
let id = notes.length + 1;

app.get('/api/notes', (req, res) => {
    res.json(notes);
})

app.post('/api/notes', (req, res) => {
    req.body.id = id++;
    notes.forEach(note => {
        if(req.body.id === note.id) {
            req.body.id++
        }
    })

    notes.push(req.body)
    fs.writeFile('./db/db.json',JSON.stringify(notes), function(error) {
            if (error) throw error;

            res.json(notes);
        }
    )
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    for (let i=0; i<notes.length; i++) {
        if(notes[i].id === parseInt(req.params.id)) {
            notes.splice(i, 1)
        }
    }
    fs.writeFile('./db/db.json', JSON.stringify(notes), function(error) {
        if (error) throw error;
        res.json(notes);
        })
})
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});



// The application should have a db.json file on the back end 
// that will be used to store and retrieve notes using the fs module.
// The following HTML routes should be created:
// GET /notes should return the notes.html file.
// GET * should return the index.html file.
// The following API routes should be created:
// GET /api/notes should read the db.json file 
// and return all saved notes as JSON.
// POST /api/notes should receive a new note to save on the request body,
//  add it to the db.json file, and then return the new note to the client. 
// You'll need to find a way to give each note a unique id when it's saved 
// (look into npm packages that could do this for you).