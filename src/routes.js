const express = require("express");
const multer = require('multer');

const routes = express.Router();
const writeController = require("./app/controller/writeController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



routes.get("/pets/main", writeController.index);

routes.delete("/pets/delete/:id", writeController.deletePet);

routes.post("/newPet", upload.single('image'), writeController.storePet);

routes.post("/newUser", writeController.storeUser);

module.exports = routes;