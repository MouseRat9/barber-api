import express from "express";
import cors from "cors";
import router from "./routes.js";
import dotenv from 'dotenv';
import { db } from './database/sqlite.js';

// Carregar variáveis de ambiente do .env
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Erro interno do servidor",
        message: process.env.NODE_ENV === 'development' ? err.message : "Ocorreu um erro interno"
    });
});

app.use(router);

// Rota de verificação de saúde da API
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'online', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});

// Tratamento de desligamento gracioso
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
    console.log('Iniciando desligamento gracioso...');
    server.close(() => {
        console.log('Servidor HTTP fechado.');
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar conexão com banco de dados:', err);
                process.exit(1);
            }
            console.log('Conexão com banco de dados fechada.');
            process.exit(0);
        });
    });
    
    // Se após 10 segundos o servidor não encerrar, forçamos o encerramento
    setTimeout(() => {
        console.error('Não foi possível encerrar graciosamente, forçando desligamento');
        process.exit(1);
    }, 10000);
}