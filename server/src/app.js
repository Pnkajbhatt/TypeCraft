import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import authRouter from "./features/auth/auth.Route.js";
import paragraphRoutes from "./features/paragraph/paragraph.route.js";
import sessionRoutes from "./features/session/session.route.js";
import progressRoutes from "./features/users/progress.rotes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("good");
});

app.use("/api/auth", authRouter);

app.use("/api/users", progressRoutes);
app.use("/api/paragraphs", paragraphRoutes);
app.use("/api/sessions", sessionRoutes);
app.use(errorHandler);

export default app;
