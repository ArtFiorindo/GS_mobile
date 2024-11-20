const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./lista-tarefas.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados: ' + err.message);
  } else {
    console.log('Conexão com o banco de dados estabelecida.');
  }
});

// Criação da tabela de usuários
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `);
});

// Criação da tabela `medicoes` com o novo campo `created_at`
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS medicoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      torre TEXT NOT NULL,
      kwh REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES usuarios (id)
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela medicoes: ' + err.message);
    } else {
      console.log('Tabela medicoes criada com sucesso.');
    }
  });
});

module.exports = db;
