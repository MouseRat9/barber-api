import { query } from "../database/sqlite.js";

async function Listar(id_user, dt_start, dt_end, id_barber) {
    let filtro = [];
    let sql = `
        SELECT a.id_appointment, a.id_user, a.id_barber, a.id_service, a.booking_date, a.booking_hour,
               u.name as user, b.name as barber, s.description as service, bs.price
        FROM appointments a
        JOIN users u ON (u.id_user = a.id_user)
        JOIN barbers b ON (b.id_barber = a.id_barber)
        JOIN barbers_services bs ON (bs.id_barber = a.id_barber AND bs.id_service = a.id_service)
        JOIN services s ON (s.id_service = a.id_service)
        WHERE 1=1
    `;

    if (id_user) {
        sql += " AND a.id_user = ?";
        filtro.push(id_user);
    }

    if (dt_start) {
        sql += " AND a.booking_date >= ?";
        filtro.push(dt_start);
    }

    if (dt_end) {
        sql += " AND a.booking_date <= ?";
        filtro.push(dt_end);
    }

    if (id_barber) {
        sql += " AND a.id_barber = ?";
        filtro.push(id_barber);
    }

    sql += " ORDER BY a.booking_date, a.booking_hour";

    const appointments = await query(sql, filtro);
    return appointments;
}

async function Inserir(id_user, id_barber, id_service, booking_date, booking_hour) {
    let sql = `
        INSERT INTO appointments(id_user, id_barber, id_service, booking_date, booking_hour)
        VALUES(?, ?, ?, ?, ?) RETURNING id_appointment
    `;
    const appointment = await query(sql, [id_user, id_barber, id_service, booking_date, booking_hour]);
    return appointment[0];
}

async function Excluir(id_user, id_appointment) {
    let filtro = [id_appointment];
    let sql = `DELETE FROM appointments WHERE id_appointment = ?`;
    
    if (id_user) {
        sql += " AND id_user = ?";
        filtro.push(id_user);
    }
    
    await query(sql, filtro);
    return { id_appointment };
}

async function ListarId(id_appointment) {
    let sql = `
        SELECT a.id_appointment, a.id_user, a.id_barber, a.id_service, a.booking_date, a.booking_hour,
               u.name as user, b.name as barber, s.description as service, bs.price
        FROM appointments a
        JOIN users u ON (u.id_user = a.id_user)
        JOIN barbers b ON (b.id_barber = a.id_barber)
        JOIN barbers_services bs ON (bs.id_barber = a.id_barber AND bs.id_service = a.id_service)
        JOIN services s ON (s.id_service = a.id_service)
        WHERE a.id_appointment = ?
    `;
    
    const appointment = await query(sql, [id_appointment]);
    return appointment[0];
}

async function Editar(id_appointment, id_user, id_barber, id_service, booking_date, booking_hour) {
    let sql = `
        UPDATE appointments 
        SET id_user = ?, id_barber = ?, id_service = ?, booking_date = ?, booking_hour = ?
        WHERE id_appointment = ?
    `;
    
    await query(sql, [id_user, id_barber, id_service, booking_date, booking_hour, id_appointment]);
    return { id_appointment };
}

export default { Listar, Inserir, Excluir, ListarId, Editar };