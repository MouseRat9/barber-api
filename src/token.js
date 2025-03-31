import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis do arquivo .env

const secretToken = process.env.JWT_SECRET; // Usar a chave secreta do arquivo .env

function CreateToken(id_user) {
    const token = jwt.sign({ id_user }, secretToken, { expiresIn: '1d' }); // Expira em 1 dia
    return token;
}

function ValidateToken(req, res, next) {
    const authToken = req.headers.authorization;
    
    if (!authToken) {
        return res.status(401).json({ error: "Token não fornecido. Por favor, forneça um token válido." });
    }

    const [bearer, token] = authToken.split(" ");
    
    if (bearer !== 'Bearer') {
        return res.status(401).json({ error: "Formato de token inválido. Use 'Bearer <token>'." });
    }

    jwt.verify(token, secretToken, (err, tokenDecoded) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido. Por favor, verifique seu token." });
        }
        req.id_user = tokenDecoded.id_user;
        next();
    });
}

export default { CreateToken, ValidateToken };
