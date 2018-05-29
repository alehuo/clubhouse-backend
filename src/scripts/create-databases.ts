// This script creates databases that are needed by the back-end.

require("dotenv").config();

import { createConnection, QueryError } from "mysql2/promise";

async function createTables() {
  // Create connection
  const con = await createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_POST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  });

  try {
    // Create databases
    await con.execute(
      "CREATE DATABASE " +
        process.env.MYSQL_DB_NAME +
        " DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_unicode_ci"
    );
    await con.execute(
      "CREATE DATABASE " +
        process.env.MYSQL_DB_NAME +
        "_dev" +
        " DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_unicode_ci"
    );
    await con.execute(
      "CREATE DATABASE " +
        process.env.MYSQL_DB_NAME +
        "_test" +
        " DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_unicode_ci"
    );
    console.log("Created development, test and production databases.");
    process.exit(0);
  } catch (err) {
    console.log("Error: %s", err.message)
    process.exit(0);
  }
}

// Run script
createTables();
