const app = require('./app'); // Importa a configuração do app
const PORT = 3000;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
