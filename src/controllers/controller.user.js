import serviceUser from "../services/service.user.js";

async function Inserir(req, res) {
    const { name, email, password } = req.body;
    const user = await serviceUser.Inserir(name, email, password);
    
    if (user.error === "EMAIL_ALREADY_EXISTS") {
        return res.status(400).json({ error: "Email já cadastrado" });
    }
    
    res.status(201).json(user);
}

async function Login(req, res) {
    const { email, password } = req.body;
    const user = await serviceUser.Login(email, password);
    
    if (user.length === 0) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
    }
    
    res.status(200).json(user);
}

async function Profile(req, res) {
    const id_user = req.id_user;
    const user = await serviceUser.Profile(id_user);
    
    res.status(200).json(user);
}

async function InserirAdmin(req, res) {
    const { name, email, password } = req.body;
    const user = await serviceUser.InserirAdmin(name, email, password);
    
    if (user.error === "EMAIL_ALREADY_EXISTS") {
        return res.status(400).json({ error: "Email já cadastrado" });
    }
    
    res.status(201).json(user);
}

async function LoginAdmin(req, res) {
    const { email, password } = req.body;
    const user = await serviceUser.LoginAdmin(email, password);
    
    if (user.length === 0) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
    }
    
    res.status(200).json(user);
}

async function Listar(req, res) {
    const users = await serviceUser.Listar();
    res.status(200).json(users);
}

export default { Inserir, Login, Profile, InserirAdmin, LoginAdmin, Listar };