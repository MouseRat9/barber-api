import express from "express";
import cors from "cors";
import router from "./routes.js";
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do .env
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});
