const express = require("express");
const router = express.Router();

const Room = require("../models/roomModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.send(rooms);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get("/getroombyid/:roomid", async (req, res) => {
  const roomid = req.params.roomid;
  try {
    const room = await Room.findOne({ _id: roomid });
    res.send(room);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/addroom", async (req, res) => {
  try {
    const newroom = new Room(req.body);
    await newroom.save();
    res.send("Nuova stanza aggiunta");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/delete-room/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Stanza non trovata" });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Stanza cancellata con successo" });
  } catch (error) {
    console.error("Errore nella cancellazione della stanza:", error);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
