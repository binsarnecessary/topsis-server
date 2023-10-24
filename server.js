const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.config = require("./config/dbconfig");

app.get("/", (req, res) => {
  res.send("Hello, World");
});

require("./services/authService")(app, global.config.pool)
require("./services/newsService")(app, global.config.pool);
require("./services/topsisService")(app, global.config.pool);
require("./services/criteriaService")(app, global.config.pool);
require("./services/alternativeService")(app, global.config.pool);
// require("./services/SpecialisDokterServire")(app, global.config.pool);
// require("./services/Pasien")(app, global.config.pool);
// require("./services/specServices")(app, global.config.pool);
// require("./services/landingPageService")(app, global.config.pool)
// require("./services/hubunganPasienService")(app, global.config.pool);
// require("./services/cariObatService")(app, global.config.pool);
// require("./services/detailDokterService")(app, global.config.pool);

app.listen(process.env.PORT, () => {
  console.log(`Server Listening on ${process.env.PORT}`);
});
