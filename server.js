const express = require("express");

const app = express();

const connectDb = require("./db");
const roomRouter = require("./router/roomRouter");
const userRouter = require("./router/userRouter");
const bookingRouter = require("./router/bookingRouter");

connectDb();

app.use(express.json());

app.use("/api/rooms", roomRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server sulla porta: ${port}`));
