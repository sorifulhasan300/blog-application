import express, { Router } from "express";
import router from "./route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL,
    credentials: true,
  })
);
app.use(express.json());
router.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/", router);

app.get("/", (req, res) => {
  res.send("hello world");
});
export default app;
