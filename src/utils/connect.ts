const mongoose = require("mongoose");
import logger from "./logger";

const connect = async () => {
  const dbUri = process.env.MONGOOSE_URI;

  try {
    await mongoose.connect(dbUri);
    logger.info("Database Connected");
  } catch (error) {
    logger.error("Could not connect to the Database");
    process.exit(1);
  }
};

export default connect;
