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

async function verificarBloqueio(booking_date, id_barber) {
    try {
        // Verifica se existe um bloqueio para o dia específico
        // Se id_barber for null ou undefined, verifica apenas bloqueios gerais
        // Se id_barber for fornecido, verifica bloqueios específicos para este barbeiro e bloqueios gerais
        const bloqueios = await repoAppointment.ListarBloqueios(booking_date, id_barber);
        return bloqueios.length > 0;
    } catch (error) {
        console.error("Erro ao verificar bloqueio:", error);
        throw error;
    }
}

async function obterMensagemBloqueio(id_barber, booking_date) {
    const bloqueios = await repoAppointment.ListarBloqueios(booking_date, id_barber);
    
    if (bloqueios.length > 0) {
        // Verifica se o bloqueio é específico para este barbeiro ou geral
        const bloqueioGeral = bloqueios.some(b => b.id_barber === null);
        
        if (bloqueioGeral) {
            return "Barbearia fechada neste dia. Por favor, escolha outra data.";
        } else {
            return "O barbeiro não atenderá neste dia. Por favor, escolha outra data ou outro profissional.";
        }
    }
    
    return null;
}

async function Inserir(id_user, id_barber, id_service, booking_date, booking_hour) {
    // Verifica se o dia está bloqueado
    const diaBloqueado = await verificarBloqueio(booking_date, id_barber);
    
    if (diaBloqueado) {
        const mensagem = await obterMensagemBloqueio(id_barber, booking_date);
        return { error: "DIA_BLOQUEADO", message: mensagem };
    }
    
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
    
    // Se a data está sendo alterada, verifica se o novo dia está bloqueado
    if (agendamentoAtual.booking_date != booking_date) {
        const diaBloqueado = await verificarBloqueio(booking_date, id_barber);
        
        if (diaBloqueado) {
            const mensagem = await obterMensagemBloqueio(id_barber, booking_date);
            return { error: "DIA_BLOQUEADO", message: mensagem };
        }
    }
    
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
    if (!data) {
        return { error: "Parâmetros inválidos", message: "A data é obrigatória" };
    }
    
    try {
        // Verifica se o dia está bloqueado
        const bloqueios = await repoAppointment.ListarBloqueios(data, id_barber);
        const diaBloqueado = bloqueios.length > 0;
        
        if (diaBloqueado) {
            // Se o dia estiver bloqueado, retorna todas as horas como indisponíveis
            // Verifica se o bloqueio é específico para este barbeiro ou geral
            const bloqueioGeral = bloqueios.some(b => b.id_barber === null);
            
            return { 
                success: true,
                dayBlocked: true,
                message: bloqueioGeral 
                    ? "Barbearia fechada neste dia. Por favor, escolha outra data."
                    : "O barbeiro não atenderá neste dia. Por favor, escolha outra data ou outro profissional."
            };
        }
        
        const agendamentos = await repoAppointment.Listar("", data, data, id_barber);
        const horariosOcupados = agendamentos.map(app => app.booking_hour);
        
        return { 
            success: true,
            dayBlocked: false,
            bookedHours: horariosOcupados 
        };
    } catch (error) {
        console.error("Erro ao verificar disponibilidade:", error);
        throw error;
    }
}

async function bloquearDia(date, id_barber = null) {
    try {
        // Se id_barber for null, bloqueia o dia para todos os barbeiros
        return await repoAppointment.InserirBloqueio(date, id_barber);
    } catch (error) {
        console.error("Erro ao bloquear dia:", error);
        throw error;
    }
}

async function desbloquearDia(date, id_barber = null) {
    try {
        // Verifica se o dia está bloqueado
        const bloqueios = await repoAppointment.ListarBloqueios(date, id_barber);
        const diaBloqueado = bloqueios.length > 0;
        
        if (!diaBloqueado) {
            return { 
                error: "DIA_NAO_BLOQUEADO", 
                message: "Este dia não está bloqueado para o barbeiro selecionado." 
            };
        }
        
        // Remove o bloqueio
        return await repoAppointment.RemoverBloqueio(date, id_barber);
    } catch (error) {
        console.error("Erro ao desbloquear dia:", error);
        throw error;
    }
}

export default { 
    Listar, 
    Inserir, 
    Excluir, 
    ListarId, 
    Editar, 
    verificarDisponibilidade,
    verificarBloqueio,
    listarHorariosIndisponiveis,
    bloquearDia,
    desbloquearDia
};