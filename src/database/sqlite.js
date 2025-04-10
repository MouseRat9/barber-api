import sqlite3 from "sqlite3";
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config(); // Carrega as variáveis do arquivo .env

const SQLite = sqlite3.verbose();
const dbPath = process.env.DB_PATH || 'src/database/banco.db'; // Usar caminho do banco de dados configurado

// Garantir que o diretório do banco de dados existe
const dbDir = dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Opção para garantir que as transações sejam persistidas corretamente
const db = new SQLite.Database(dbPath, SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Erro ao conectar com banco: " + err.message);
    } else {
        console.log('Conectado ao banco de dados');
        
        // Configurar o modo para garantir maior integridade dos dados
        db.run("PRAGMA journal_mode = WAL;"); // Write-Ahead Logging
        db.run("PRAGMA synchronous = NORMAL;"); // Menor que FULL mas mais rápido
        db.run("PRAGMA foreign_keys = ON;"); // Garantir integridade referencial
    }
});

// Adicionar manipulação de fechamento
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Conexão com o banco de dados fechada.');
        process.exit(0);
    });
});

function query(command, params, method = 'all') {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db[method](command, params, function(error, result) {
                if (error) {
                    console.error("Erro na query:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    });
}

export { db, query };