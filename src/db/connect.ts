import mangoose from "mongoose";
import config from "config";
import log from "../logger";

const connect = async () => {
  const dbURI = config.get("dbUri") as string;

  try {
    await mangoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    log.info("mongodb connection established");
  } catch (e) {
    if (e === "string") {
      log.error("database error", e);
    } else if (e instanceof Error) {
      log.error("database error", e.message);
      process.exit(1);
    }
  }
};

export default connect;
