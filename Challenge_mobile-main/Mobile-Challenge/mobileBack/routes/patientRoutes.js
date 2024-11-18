const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Definindo as rotas para os pacientes
router.post('/pacientes', patientController.createPaciente);
router.get('/pacientes', patientController.getPacientes);
router.get('/pacientes/:id', patientController.getPacienteById);
router.put('/pacientes/:id', patientController.updatePaciente);
router.delete('/pacientes/:id', patientController.deletePaciente);

module.exports = router;
