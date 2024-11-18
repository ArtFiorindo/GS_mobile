const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para cadastro de usuário
router.post('/register', userController.registerUser);

// Rota para login de usuário
router.post('/login', userController.loginUser);

// Rota para atualizar usuário (username ou email)
router.put('/update', authMiddleware, userController.updateUser);

router.get('/me', authMiddleware, userController.getUserDetails);

// Rota para redefinição de senha
router.post('/reset-password', userController.resetPassword);

module.exports = router;
