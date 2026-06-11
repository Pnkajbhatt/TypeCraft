import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import authRouter from "./features/auth/auth.Route.js";
import paragraphRoutes from "./features/paragraph/paragraph.route.js";
import sessionRoutes from "./features/session/session.route.js";
import progressRoutes from "./features/users/progress.rotes.js";
import cors from "cors";

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            process.env.CLIENT_URL,
        ];
        if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// handle preflight for all routes
app.options("/(.*)", (req, res) => {
    res.sendStatus(204);
});

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("good");
});

app.get("/test", (req, res) => {
  res.json({ message: "Backend is reachable", origin: req.headers.origin });
});
app.use("/api/auth", authRouter);

app.use("/api/users", progressRoutes);
app.use("/api/paragraphs", paragraphRoutes);
app.use("/api/sessions", sessionRoutes);
app.use(errorHandler);

export default app;
