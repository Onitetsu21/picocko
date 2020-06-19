const express = require("express");
const router = express.Router();



const userCtrl = require("../controllers/user");

// chiffre le mdp et ajoute l'utilisateur à la BD 
router.post("/signup", userCtrl.createUser);

// Vérifie les infos d'identification en renvoyant l'userId depuis la BD + jeton JSON signé
router.post("/login", userCtrl.login);

module.exports = router;