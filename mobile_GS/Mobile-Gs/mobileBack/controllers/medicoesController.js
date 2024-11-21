const db = require('../db/database');

// Criar uma nova medição
exports.createMedicao = (req, res) => {
  const { user_id, torre, kwh } = req.body;

  // Validação básica
  if (!user_id || !torre || !kwh) {
    return res.status(400).json({ error: 'Todos os campos (user_id, torre e kwh) são obrigatórios.' });
  }

  // Inserir no banco de dados
  db.run(
    `INSERT INTO medicoes (user_id, torre, kwh) VALUES (?, ?, ?)`,
    [user_id, torre, kwh],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar a medição.', details: err.message });
      }

      // Buscar a medição recém-criada para incluir o campo created_at na resposta
      db.get(
        `SELECT * FROM medicoes WHERE id = ?`,
        [this.lastID],
        (err, medicao) => {
          if (err) {
            return res.status(500).json({ error: 'Erro ao buscar medição criada.', details: err.message });
          }

          res.status(201).json({ message: 'Medição criada com sucesso!', medicao });
        }
      );
    }
  );
};

// Listar todas as medições
exports.getAllMedicoes = (req, res) => {
  db.all(`SELECT * FROM medicoes`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar medições.', details: err.message });
    }
    res.status(200).json(rows);
  });
};

// Obter uma medição específica
exports.getMedicaoById = (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM medicoes WHERE id = ?`, [id], (err, medicao) => {
    if (err || !medicao) {
      return res.status(404).json({ error: 'Medição não encontrada.' });
    }
    res.status(200).json(medicao);
  });
};

// Atualizar uma medição
exports.updateMedicao = (req, res) => {
  const { id } = req.params;
  const { torre, kwh } = req.body;

  if (!torre && !kwh) {
    return res.status(400).json({ error: 'É necessário fornecer pelo menos um campo para atualizar.' });
  }

  const updates = [];
  const params = [];

  if (torre) {
    updates.push('torre = ?');
    params.push(torre);
  }
  if (kwh) {
    updates.push('kwh = ?');
    params.push(kwh);
  }

  params.push(id);

  const query = `UPDATE medicoes SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar medição.', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Medição não encontrada.' });
    }

    // Retornar a medição atualizada
    db.get(`SELECT * FROM medicoes WHERE id = ?`, [id], (err, medicao) => {
      if (err || !medicao) {
        return res.status(500).json({ error: 'Erro ao buscar medição atualizada.' });
      }
      res.status(200).json({ message: 'Medição atualizada com sucesso!', medicao });
    });
  });
};

// Deletar uma medição
exports.deleteMedicao = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM medicoes WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar medição.', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Medição não encontrada.' });
    }
    res.status(200).json({ message: 'Medição deletada com sucesso!' });
  });
};
