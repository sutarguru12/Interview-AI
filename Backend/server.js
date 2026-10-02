require("dotenv").config();
const DB_Connect = require("./src/config/database");
const app = require("./src/app");

const PORT = process.env.PORT;

require("./src/config/database");

DB_Connect();

app.listen(PORT, () => {
  console.log(`Listniing on port ${PORT}`);
});
