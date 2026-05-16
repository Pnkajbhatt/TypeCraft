import jwt from "jsonwebtoken";

const autheniticate = (req, res, next) => {
  const authHeader = req.header["authorization"];

  const token = authHeader && authHeader.split("")[1];

  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token.", err });
    }
    req.userId = user.userId;
    next();
  });
};

export default autheniticate;
