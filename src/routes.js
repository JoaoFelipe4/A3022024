const express = require("express");
const multer = require('multer');

const routes = express.Router();
const writeController = require("./app/controller/writeController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



routes.get("/", writeController.index);

routes.post("/newPet", upload.single('image'), writeController.storePet);

routes.post("/newUser", writeController.storeUser);

module.exports = routes;