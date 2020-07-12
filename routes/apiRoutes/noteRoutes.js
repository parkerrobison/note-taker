const router = require('express').Router();
const notes = require('../../db/db.json');
const fs = require('fs');

let id = notes.length + 1;
router.get('/notes', (req, res) => {
    res.json(notes);
})

router.post('/notes', (req, res) => {
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

router.delete('/notes/:id', (req, res) => {
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
module.exports = router;