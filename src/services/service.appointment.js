import repoAppointment from "../repositories/repository.appointment.js";

async function Listar(id_user, dt_start, dt_end, id_barber) {
    const appointments = await repoAppointment.Listar(id_user, dt_start, dt_end, id_barber);
    return appointments;
}

async function verificarDisponibilidade(id_barber, booking_date, booking_hour, id_appointment = null) {
    const appointments = await repoAppointment.Listar("", booking_date, booking_date, id_barber);
    
    const conflito = appointments.find(app => 
        app.booking_hour === booking_hour && 
        (id_appointment === null || app.id_appointment != id_appointment)
    );
    
    return conflito ? false : true;
}

async function Inserir(id_user, id_barber, id_service, booking_date, booking_hour) {
    const disponivel = await verificarDisponibilidade(id_barber, booking_date, booking_hour);
    
    if (!disponivel) {
        return { error: "HORARIO_INDISPONIVEL", message: "Este horário já está reservado. Por favor, escolha outro horário." };
    }
    
    const appointment = await repoAppointment.Inserir(id_user, id_barber, id_service, booking_date, booking_hour);
    return appointment;
}

async function Excluir(id_user, id_appointment) {
    const appointment = await repoAppointment.Excluir(id_user, id_appointment);
    return appointment;
}

async function ListarId(id_appointment) {
    const appointment = await repoAppointment.ListarId(id_appointment);
    return appointment;
}

async function Editar(id_appointment, id_user, id_barber, id_service, booking_date, booking_hour) {
    const agendamentoAtual = await repoAppointment.ListarId(id_appointment);
    
    if (agendamentoAtual.id_barber != id_barber || 
        agendamentoAtual.booking_date != booking_date || 
        agendamentoAtual.booking_hour != booking_hour) {
        
        const disponivel = await verificarDisponibilidade(id_barber, booking_date, booking_hour, id_appointment);
        
        if (!disponivel) {
            return { error: "HORARIO_INDISPONIVEL", message: "Este horário já está reservado. Por favor, escolha outro horário." };
        }
    }

    const appointment = await repoAppointment.Editar(id_appointment, id_user, id_barber, id_service, booking_date, booking_hour);
    return appointment;
}

async function listarHorariosIndisponiveis(id_barber, data) {
    if (!id_barber || !data) {
        return { error: "Parâmetros inválidos" };
    }
    
    try {
        const agendamentos = await repoAppointment.Listar("", data, data, id_barber);
        const horariosOcupados = agendamentos.map(app => app.booking_hour);
        
        return { 
            success: true,
            bookedHours: horariosOcupados 
        };
    } catch (error) {
        return { 
            error: "Erro ao verificar disponibilidade", 
            message: error.message 
        };
    }
}

export default { Listar, Inserir, Excluir, ListarId, Editar, verificarDisponibilidade, listarHorariosIndisponiveis };