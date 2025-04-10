import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// Usar uma chave secreta segura - verificar se está definida no .env
const secretToken = process.env.JWT_SECRET || "chave_segura_padrao_nao_use_em_producao";

function CreateToken(id_user) {
    try {
        if (!id_user) {
            throw new Error("ID do usuário não fornecido para criação do token");
        }
        const token = jwt.sign({ id_user }, secretToken, { expiresIn: '7d' }); // Aumentando para 7 dias
        return token;
    } catch (error) {
        console.error("Erro ao criar token:", error);
        throw error;
    }
}

function ValidateToken(req, res, next) {
    const authToken = req.headers.authorization;
    
    if (!authToken) {
        return res.status(401).json({ error: "Token não fornecido. Por favor, faça login novamente." });
    }

    // Verifica se o token tem o formato correto (Bearer token)
    const parts = authToken.split(" ");
    if (parts.length !== 2) {
        return res.status(401).json({ error: "Formato de token inválido. Use 'Bearer <token>'." });
    }

    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: "Formato de token inválido. Use 'Bearer <token>'." });
    }

    // Verifica o token
    jwt.verify(token, secretToken, (err, decoded) => {
        if (err) {
            console.error("Erro na verificação do token:", err);
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ error: "Token expirado. Por favor, faça login novamente." });
            }
            return res.status(401).json({ error: "Token inválido. Por favor, faça login novamente." });
        }
        
        // Verificar se decoded e id_user existem
        if (!decoded || decoded.id_user === undefined) {
            return res.status(401).json({ error: "Token inválido ou mal formado. Por favor, faça login novamente." });
        }
        
        req.id_user = decoded.id_user;
        next();
    });
}

export default { CreateToken, ValidateToken };