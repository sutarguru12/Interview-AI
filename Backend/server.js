const DB_Connect = require("./src/config/database");
const app = require("./src/app");

require("dotenv").config();
require("./src/config/database");

DB_Connect();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listniing on port ${PORT}`);
});
