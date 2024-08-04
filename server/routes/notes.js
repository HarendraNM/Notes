const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');


router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
})


router.post("/addnote", fetchuser, [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "Enter valid description").isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;
        const notes = new Notes({
            title, description, tag, user: req.user.id
        });
        const saveNotes = await notes.save();
        res.json({ saveNotes });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
})

router.put("/updatenote/:id", fetchuser, [
    body("title", "Enter valid Title").isLength({ min: 3 }),
    body("description", "Enter valid description").isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json("Access Denied!");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server error" });
    }
})

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send(" Not Exists") }
        
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send(" Not Allowed ")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success" : "Note has been deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
});

module.exports = router;