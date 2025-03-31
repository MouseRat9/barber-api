import serviceBarber from "../services/service.barber.js";

async function Listar(req, res) {
    const name = req.query.name;
    const barbers = await serviceBarber.Listar(name);
    res.status(200).json(barbers);
}

async function Inserir(req, res) {
    const {name, specialty, icon} = req.body;
    const barber = await serviceBarber.Inserir(name, specialty, icon);
    res.status(201).json(barber);
}

async function Editar(req, res) {
    const id_barber = req.params.id_barber;
    const {name, specialty, icon} = req.body;
    const barber = await serviceBarber.Editar(id_barber, name, specialty, icon);
    res.status(200).json(barber);
}

async function Excluir(req, res) {
    const id_barber = req.params.id_barber;
    const barber = await serviceBarber.Excluir(id_barber);
    res.status(200).json(barber);
}

async function ListarServicos(req, res) {
    const id_barber = req.params.id_barber;
    const serv = await serviceBarber.ListarServicos(id_barber);
    res.status(200).json(serv);
}

export default { Listar, Inserir, Editar, Excluir, ListarServicos };