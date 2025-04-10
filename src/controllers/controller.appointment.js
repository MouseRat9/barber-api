import serviceAppointment from '../services/service.appointment.js';

async function ListarByUser(req, res) {
  const id_user = req.id_user;
  const appointments = await serviceAppointment.Listar(id_user);

  res.status(200).json(appointments);
}

async function Listar(req, res) {
  const dt_start = req.query.dt_start;
  const dt_end = req.query.dt_end;
  const id_barber = req.query.id_barber;
  const appointments = await serviceAppointment.Listar(
    0,
    dt_start,
    dt_end,
    id_barber
  );

  res.status(200).json(appointments);
}

async function ListarId(req, res) {
  const id_appointment = req.params.id_appointment;
  const appointments = await serviceAppointment.ListarId(id_appointment);

  res.status(200).json(appointments);
}

async function Inserir(req, res) {
  const id_user = req.id_user;
  const { id_barber, id_service, booking_date, booking_hour } = req.body;
  const appointment = await serviceAppointment.Inserir(
    id_user,
    id_barber,
    id_service,
    booking_date,
    booking_hour
  );

  if (appointment.error) {
    return res.status(400).json(appointment); // Enviamos o objeto completo com error e message
  }

  res.status(201).json(appointment);
}

async function Excluir(req, res) {
  const id_user = req.id_user;
  const id_appointment = req.params.id_appointment;
  const appointment = await serviceAppointment.Excluir(id_user, id_appointment);

  res.status(200).json(appointment);
}

async function InserirAdmin(req, res) {
  const { id_user, id_barber, id_service, booking_date, booking_hour } =
    req.body;
  const appointment = await serviceAppointment.Inserir(
    id_user,
    id_barber,
    id_service,
    booking_date,
    booking_hour
  );

  if (appointment.error) {
    return res.status(400).json(appointment); // Enviamos o objeto completo com error e message
  }

  res.status(201).json(appointment);
}

async function EditarAdmin(req, res) {
  const id_appointment = req.params.id_appointment;
  const { id_user, id_barber, id_service, booking_date, booking_hour } =
    req.body;
  const appointment = await serviceAppointment.Editar(
    id_appointment,
    id_user,
    id_barber,
    id_service,
    booking_date,
    booking_hour
  );

  if (appointment.error) {
    return res.status(400).json(appointment); // Enviamos o objeto completo com error e message
  }

  res.status(200).json(appointment);
}

async function VerificarDisponibilidade(req, res) {
    const { id_barber, date } = req.query;
    
    if (!date) {
        return res.status(400).json({ error: "Parâmetro date é obrigatório" });
    }
    
    try {
        // Converte string vazia para null
        const barberID = id_barber === "" ? null : id_barber;
        const resultado = await serviceAppointment.listarHorariosIndisponiveis(barberID, date);
        
        if (resultado.error) {
            return res.status(400).json(resultado);
        }
        
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Erro ao verificar disponibilidade:", error);
        return res.status(500).json({ 
            error: "Erro interno ao verificar disponibilidade",
            message: error.message 
        });
    }
}

// Função: Bloquear um dia para agendamentos
async function BloquearDia(req, res) {
  const { date, id_barber } = req.body;
  
  if (!date) {
      return res.status(400).json({ error: "A data é obrigatória" });
  }
  
  try {
      // Converte string vazia para null
      const barberID = id_barber === "" ? null : id_barber;
      const resultado = await serviceAppointment.bloquearDia(date, barberID);
      
      if (resultado.error) {
          return res.status(400).json(resultado);
      }
      
      return res.status(201).json(resultado);
  } catch (error) {
      console.error("Erro ao bloquear dia:", error);
      return res.status(500).json({ 
          error: "Erro interno ao bloquear dia",
          message: error.message 
      });
  }
}

// Função: Desbloquear um dia para agendamentos
async function DesbloquearDia(req, res) {
  const { date, id_barber } = req.body;
  
  if (!date) {
      return res.status(400).json({ error: "A data é obrigatória" });
  }
  
  try {
      // Converte string vazia para null
      const barberID = id_barber === "" ? null : id_barber;
      
      // Verificar explicitamente se o dia está bloqueado antes de tentar desbloquear
      const diaBloqueado = await serviceAppointment.verificarBloqueio(date, barberID);
      
      if (!diaBloqueado) {
          return res.status(400).json({ 
              error: "DIA_NAO_BLOQUEADO", 
              message: "Este dia não está bloqueado para o barbeiro selecionado." 
          });
      }
      
      const resultado = await serviceAppointment.desbloquearDia(date, barberID);
      
      if (resultado.error) {
          return res.status(400).json(resultado);
      }
      
      return res.status(200).json(resultado);
  } catch (error) {
      console.error("Erro ao desbloquear dia:", error);
      return res.status(500).json({ 
          error: "Erro interno ao desbloquear dia",
          message: error.message 
      });
  }
}

export default { 
  ListarByUser, 
  Inserir, 
  Excluir, 
  Listar, 
  ListarId, 
  InserirAdmin, 
  EditarAdmin, 
  VerificarDisponibilidade,
  BloquearDia,
  DesbloquearDia
};