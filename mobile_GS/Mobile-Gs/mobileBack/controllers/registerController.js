const bcrypt = require('bcryptjs');
const db = require('../db/database');

// Cadastro de usuário
exports.registerUser = (req, res) => {
  const { username, password, role } = req.body;

  // Hash da senha
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err.message });

    // Insere o usuário no banco
    db.run(
      "INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      }
    );
  });
};
