const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "Utente già esistente", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "Utente creato con successo", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Errore nel creare l'utente",
      success: false,
      error,
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "Email o password non validi" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Email o password non validi" });
    }

    const token = jwt.sign({ id: user._id }, "HotelBooking");

    res.status(200).send({
      success: true,
      message: "Login effettuato con successo",
      data: {
        token,
        userName: user.name,
        userEmail: user.email,
        userId: user._id.toString(),
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Errore nel login",
      error: error.message,
    });
  }
});

router.post("/get-user-info-by-id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(200)
        .send({ message: "Utente non esistente", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Errore nel recupero delle informazioni dell'utente",
      success: false,
    });
  }
});

router.post("/getallusers", async (req, res) => {
  try {
    const users = await User.find(); // Ottieni tutti gli utenti
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero degli utenti" });
  }
});

router.delete("/delete-profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Utente cancellato con successo" });
  } catch (error) {
    console.error("Errore nella cancellazione dell utente:", error);
  }
});

module.exports = router;
