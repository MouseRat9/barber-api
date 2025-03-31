import sqlite3 from "sqlite3";

const SQLite = sqlite3.verbose();

// Pega o caminho do banco de dados da variável de ambiente DB_PATH ou usa o caminho local padrão
const dbPath = process.env.DB_PATH || "./src/database/banco.db";

// Função para executar consultas no banco
function query(command, params, method = 'all') {
    return new Promise(function (resolve, reject) {
        db[method](command, params, function (error, result) {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

// Conectar ao banco de dados com o caminho configurado
const db = new SQLite.Database(dbPath, SQLite.OPEN_READWRITE, (err) => {
    if (err) return console.log("Erro ao conectar com banco: " + err.message);
});

export { db, query };
