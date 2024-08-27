const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(403)
      .send({ message: "Nessun token fornito.", success: false });
  }

  jwt.verify(token.split(" ")[1], "HotelBooking", (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({
          message: "Errore nell'autenticazione del token.",
          success: false,
        });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
