const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'inscription
router.post('/register', authController.registerUser);

// Route pour la connexion
router.post('/login', authController.loginUser);

module.exports = router;