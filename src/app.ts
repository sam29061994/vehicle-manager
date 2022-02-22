import express from "express";
import config from "config";
import log from "./logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connect from "./db/connect";
import userRoutes from "./routes/userRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import { extractUser, alloweCredentials } from "./middleware/index";

const port = config.get("port") as number;
const host = config.get("host") as string;
const allowedOrigins = config.get("allowedOrigins") as string[];

dotenv.config({ path: "./config.env" });

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(alloweCredentials);
app.use(cookieParser());

// Cross Origin Resource Sharing
app.use(
  cors({
    origin: function (origin = "", callback) {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/healthcheck", (req, res) => res.send(200));

app.use(extractUser);

app.use("/api/user", userRoutes);
app.use("/api/vehicle", vehicleRoutes);

app.listen(port, host, () => {
  log.info(`server is listening on http://${host}:${port}`);
  connect();
});
