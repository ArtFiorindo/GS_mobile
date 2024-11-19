const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

// Cadastro de usuário
exports.registerUser = (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err.message });

    db.run(
      "INSERT INTO usuarios (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role],
      function (err) {
        if (err) {
          console.error('Erro ao inserir no banco:', err.message); // Log detalhado
          return res.status(500).json({ error: 'Erro ao criar usuário', details: err.message });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      }
    );
    
  });
};

// Login de usuário usando `username`
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  // Busca o usuário pelo `username`
  db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Compara a senha usando bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch || err) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      // Cria o token JWT
      const token = jwt.sign({ id: user.id, role: user.role }, 'secreta-chave', { expiresIn: '1h' });
      res.status(200).json({ token });
    });
  });
};

exports.getUserDetails = (req, res) => {
  const { id } = req.user; // ID do usuário extraído do token JWT
  db.get("SELECT username, email FROM usuarios WHERE id = ?", [id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.status(200).json(user);
  });
};


// Atualização de username e email
exports.updateUser = (req, res) => {
  const { id } = req.user; // Pegamos o ID do usuário logado do token JWT
  const { username, email } = req.body;

  if (!username && !email) {
    return res.status(400).json({ error: 'É necessário fornecer um username ou email para atualizar.' });
  }

  const updates = [];
  const params = [];

  if (username) {
    updates.push('username = ?');
    params.push(username);
  }
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }

  params.push(id);

  const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, params, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário.', details: err.message });
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
  });
};


// Verificar se o username existe e retornar o user_id
exports.verifyUser = (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'O campo username é obrigatório.' });
  }

  db.get('SELECT id FROM usuarios WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao consultar o banco de dados.', details: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ userId: user.id });
  });
};


// Redefinição de senha usando `email`
exports.resetPassword = (req, res) => {
  const { email, newPassword } = req.body;

  // Busca o usuário pelo `email`
  db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se a nova senha é igual à senha atual
    bcrypt.compare(newPassword, user.password, (err, isSamePassword) => {
      if (isSamePassword) {
        return res.status(400).json({ error: 'A nova senha não pode ser igual à senha atual.' });
      }

      // Criptografa a nova senha
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err.message });

        // Atualiza a senha do usuário com o `email` fornecido
        db.run("UPDATE usuarios SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao redefinir a senha' });
          }
          res.status(200).json({ message: 'Senha redefinida com sucesso!' });
        });
      });
    });
  });
};
