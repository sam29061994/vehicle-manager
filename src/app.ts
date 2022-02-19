import express from "express";
import config from "config";
import log from "./logger";
import dotenv from "dotenv";
import connect from "./db/connect";
import userRoutes from "./routes/userRoutes";
import { extractUser } from "./middleware/index";

const port = config.get("port") as number;
const host = config.get("host") as string;

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(extractUser);

app.use("/api/user", userRoutes);

app.listen(port, host, () => {
  log.info(`server is listening on http://${host}:${port}`);
  connect();
});
