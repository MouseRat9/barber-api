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

  res.status(200).json(appointment);
}


async function VerificarDisponibilidade(req, res) {
    const { id_barber, date } = req.query;
    
    if (!id_barber || !date) {
        return res.status(400).json({ error: "Parâmetros id_barber e date são obrigatórios" });
    }
    
    try {
        const resultado = await serviceAppointment.listarHorariosIndisponiveis(id_barber, date);
        
        if (resultado.error) {
            return res.status(400).json({ error: resultado.message });
        }
        
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao verificar disponibilidade" });
    }
}

export default { ListarByUser, Inserir, Excluir, Listar, ListarId, InserirAdmin, EditarAdmin, VerificarDisponibilidade };