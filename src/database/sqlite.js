import sqlite3 from "sqlite3";
import dotenv from 'dotenv';
import Database from 'better-sqlite3'

dotenv.config(); // Carrega as variáveis do arquivo .env

const SQLite = sqlite3.verbose();
const dbPath = process.env.DB_PATH || 'src/database/banco.db'; // Usar caminho do banco de dados configurado

const db = new SQLite.Database(dbPath, SQLite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error("Erro ao conectar com banco: " + err.message);
    } else {
        console.log('Conectado ao banco de dados');
    }
});

function query(command, params, method = 'all') {
    return new Promise((resolve, reject) => {
        db[method](command, params, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

export { db, query };

