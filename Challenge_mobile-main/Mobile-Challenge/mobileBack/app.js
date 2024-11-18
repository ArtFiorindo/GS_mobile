const express = require('express');
const app = express();
const cors = require('cors'); 
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middlewares/authMiddleware'); 

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Defina as rotas de usuários e pacientes
app.use('/api', userRoutes);


module.exports = app;
