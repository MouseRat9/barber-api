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

// Função: Listar bloqueios de dias
async function ListarBloqueios(data, id_barber = null) {
    try {
        let filtro = [data];
        let sql = `SELECT * FROM blocked_days WHERE block_date = ?`;
        
        if (id_barber) {
            // Se um id_barber específico for fornecido, procuramos bloqueios específicos para este barbeiro
            // OU bloqueios gerais (onde id_barber é NULL)
            sql += " AND (id_barber = ? OR id_barber IS NULL)";
            filtro.push(id_barber);
        } else {
            // Se id_barber for null, procuramos apenas bloqueios gerais
            sql += " AND id_barber IS NULL";
        }
        
        const bloqueios = await query(sql, filtro);
        return bloqueios;
    } catch (error) {
        console.error("Erro ao listar bloqueios:", error);
        throw error;
    }
}

// Função: Inserir bloqueio de dia
async function InserirBloqueio(data, id_barber) {
    try {
        // Verifica se já existe um bloqueio para esta data e barbeiro
        const bloqueiosExistentes = await ListarBloqueios(data, id_barber);
        
        if (bloqueiosExistentes.length > 0) {
            return { message: "Este dia já está bloqueado." };
        }
        
        let sql = `
            INSERT INTO blocked_days(block_date, id_barber)
            VALUES(?, ?) RETURNING id_block
        `;
        
        const bloqueio = await query(sql, [data, id_barber]);
        return { 
            message: "Dia bloqueado com sucesso.", 
            id_block: bloqueio[0].id_block 
        };
    } catch (error) {
        console.error("Erro ao inserir bloqueio:", error);
        throw error;
    }
}

// Função: Remover bloqueio de dia
async function RemoverBloqueio(data, id_barber) {
    try {
        let filtro = [data];
        let sql = `DELETE FROM blocked_days WHERE block_date = ?`;
        
        if (id_barber) {
            // Se um id_barber específico for fornecido, removemos apenas o bloqueio para este barbeiro
            sql += " AND id_barber = ?";
            filtro.push(id_barber);
        } else {
            // Se id_barber for null, removemos apenas os bloqueios gerais (onde id_barber é NULL)
            sql += " AND id_barber IS NULL";
        }
        
        await query(sql, filtro);
        return { 
            message: "Dia desbloqueado com sucesso." 
        };
    } catch (error) {
        console.error("Erro ao remover bloqueio:", error);
        throw error;
    }
}

export default { 
    Listar, 
    Inserir, 
    Excluir, 
    ListarId, 
    Editar,
    ListarBloqueios,
    InserirBloqueio,
    RemoverBloqueio
};