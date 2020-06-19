const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const stuffCtrl = require("../controllers/stuff");

const multer = require("../middleware/multer-config");

// renvoie le tableau de toutes les sauces de la BD
router.get("/", auth, stuffCtrl.getThing);

// renvoie la sauce avec l'ID fourni
router.get("/:id", auth, stuffCtrl.getOneThing);

// Créé une nouvelle sauce et la rajoute à la BD
router.post("/", auth, multer, stuffCtrl.createThing);

// Modification de la sauce avec l'ID
router.put("/:id", auth, multer, stuffCtrl.modifyThing);

// supprime la sauce avec l'ID
router.delete("/:id", auth, stuffCtrl.deleteThing);


// nombre total de "jaime" et "j'aime pas" à mettre à jour à chaque "jaime" 
router.post("/:id/like", auth, stuffCtrl.likeThing);


module.exports = router;