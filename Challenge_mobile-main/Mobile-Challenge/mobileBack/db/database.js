const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./lista-tarefas.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados: ' + err.message);
  } else {
    console.log('Conexão com o banco de dados estabelecida.');
  }
});

// Criação das tabelas se não existirem
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

  db.run(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE,
      dataNascimento TEXT NOT NULL,
      sinistro TEXT NOT NULL,
      descricao TEXT
    )
  `);
});

module.exports = db;
