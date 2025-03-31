import repoBarber from "../repositories/repository.barber.js";

async function Listar(name) {
    const barbers = await repoBarber.Listar(name);
    return barbers;
}

async function Inserir(name, specialty, icon) {
    const barber = await repoBarber.Inserir(name, specialty, icon);
    return barber;
}

async function Editar(id_barber, name, specialty, icon) {
    const barber = await repoBarber.Editar(id_barber, name, specialty, icon);
    return barber;
}

async function Excluir(id_barber) {
    const barber = await repoBarber.Excluir(id_barber);
    return barber;
}

async function ListarServicos(id_barber) {
    const services = await repoBarber.ListarServicos(id_barber);
    return services;
}

export default { Listar, Inserir, Editar, Excluir, ListarServicos };