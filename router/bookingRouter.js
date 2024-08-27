const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const moment = require("moment");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/bookroom", async (req, res) => {
  const { room, userid, startDate, endDate, totalPrice, totalDays } = req.body;

  try {
    const newbooking = new Booking({
      room: room.name,
      roomid: room._id,
      userid,
      startDate: moment(startDate).format("DD-MM-YYYY"),
      endDate: moment(endDate).format("DD-MM-YYYY"),
      totalPrice,
      totalDays,
      transactionId: "1234",
    });
    const booking = await newbooking.save();
    const roomtemp = await Room.findOne({ _id: room._id });
    roomtemp.currentbookings.push({
      bookingid: booking._id,
      startDate: moment(startDate).format("DD-MM-YYYY"),
      endDate: moment(endDate).format("DD-MM-YYYY"),
      userid: userid,
    });

    await roomtemp.save();

    res.send("Stanza prenotata");
  } catch (error) {
    return res.status(400).json({ error });
  }
});
router.get("/get-bookings-by-id", async (req, res) => {
  try {
    const userId = req.params.userid;

    const bookings = await Booking.find({ userId });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
  }
});

module.exports = router;

router.post("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero degli utenti" });
  }
});

router.delete("/delete-booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Prenotazione non trovata" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Prenotazione cancellata con successo" });
  } catch (error) {
    console.error("Errore nella cancellazione della prenotazione:", error);
    res.status(500).json({ message: "Errore del server" });
  }
});

router.delete("/delete-bookings-by-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Booking.deleteMany({ userid: userId });

    if (result.deletedCount > 0) {
      res.status(200).json({
        success: true,
        message: "Prenotazioni cancellate con successo",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Nessuna prenotazione trovata per l'utente",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Errore nella cancellazione delle prenotazioni",
    });
  }
});

module.exports = router;
