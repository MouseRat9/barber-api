import { query } from "../database/sqlite.js";

async function Listar(name) {
    let filtro = [];
    let sql = "select * from barbers ";

    if (name) {
        sql = sql + "where name like ? ";
        filtro.push('%' + name + '%');
    }
    sql = sql + "order by name";

    const barbers = await query(sql, filtro);
    return barbers;
}

async function Inserir(name, specialty, icon) {
    let sql = `insert into barbers(name, specialty, icon) values(?, ?, ?) returning id_barber`;
    const barber = await query(sql, [name, specialty, icon]);
    return barber[0];
}

async function Editar(id_barber, name, specialty, icon) {
    let sql = `update barbers set name=?, specialty=?, icon=? where id_barber = ?`;
    await query(sql, [name, specialty, icon, id_barber]);
    return { id_barber };
}

async function Excluir(id_barber) {
    let sql = `delete from barbers where id_barber = ?`;
    await query(sql, [id_barber]);
    return { id_barber };
}

async function ListarServicos(id_barber) {
    let sql = "select b.id_service, s.description, b.price from barbers_services b join services s on (s.id_service = b.id_service) where b.id_barber = ? order by s.description";
    const serv = await query(sql, [id_barber]);
    return serv;
}

export default { Listar, Inserir, Editar, Excluir, ListarServicos };