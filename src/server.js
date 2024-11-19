const express = require("express");
const db = require("./database/config");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config({ path: "../.env" });

class App {
  constructor() {
    this.express = express();

    this.database();
    this.middlewares();
    this.routes();

    this.express.listen(process.env.PORT, () =>
      console.log(`Sua API REST está funcionando na porta ${process.env.PORT} `)
    );
  }

  database() {
    mongoose.connect(db.uri, {});
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

module.exports = new App().express;