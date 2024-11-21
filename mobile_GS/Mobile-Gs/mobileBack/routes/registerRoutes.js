const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para cadastro de usuário
router.post('/register', userController.registerUser);

module.exports = router;
