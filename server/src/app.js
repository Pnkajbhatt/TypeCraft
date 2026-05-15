import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import authRouter from "./features/auth/auth.Route.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("good");
});

app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;
