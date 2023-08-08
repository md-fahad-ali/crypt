const db = require("knex")({
  client: "better-sqlite3", // or 'better-sqlite3'
  connection: {
    filename: "./cr.db",
  },
  useNullAsDefault: true,
});

db
  .raw("SELECT 1")
  .then(() => {
    console.log("connected");
  })
  .catch((e) => {
    console.log("not connected");
    console.error(e);
  });

export default db;
