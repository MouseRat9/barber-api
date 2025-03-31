import sqlite3 from "sqlite3";
import dotenv from "dotenv";

dotenv.config();

const SQLite = sqlite3.verbose();

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

const db = new SQLite.Database(dbPath, SQLite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Erro ao conectar com banco: " + err.message);
        return;
    }
    console.log(`Conectado ao banco de dados: ${dbPath}`);
});

export { db, query };

