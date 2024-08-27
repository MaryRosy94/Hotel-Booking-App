const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rentperday: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    imageurls: [],
    currentbookings: [],
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
