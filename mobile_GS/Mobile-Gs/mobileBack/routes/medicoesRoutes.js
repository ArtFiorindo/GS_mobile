const express = require('express');
const router = express.Router();
const medicoesController = require('../controllers/medicoesController');

// Criar uma medição
router.post('/medicoes', medicoesController.createMedicao);

// Listar todas as medições
router.get('/medicoes', medicoesController.getAllMedicoes);

// Obter uma medição específica
router.get('/medicoes/:id', medicoesController.getMedicaoById);

// Atualizar uma medição
router.put('/medicoes/:id', medicoesController.updateMedicao);

// Deletar uma medição
router.delete('/medicoes/:id', medicoesController.deleteMedicao);

module.exports = router;
