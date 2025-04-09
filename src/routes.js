import { Router } from "express";
import controllerBarber from "./controllers/controller.barber.js";
import controllerUser from "./controllers/controller.user.js";
import jwt from "./token.js";
import controllerAppointment from "./controllers/controller.appointment.js";

const router = Router();

// Rotas de barbeiros
router.get("/barbers", jwt.ValidateToken, controllerBarber.Listar);
router.post("/barbers", jwt.ValidateToken, controllerBarber.Inserir);
router.put("/barbers/:id_barber", jwt.ValidateToken, controllerBarber.Editar);
router.delete("/barbers/:id_barber", jwt.ValidateToken, controllerBarber.Excluir);
router.get("/barbers/:id_barber/services", jwt.ValidateToken, controllerBarber.ListarServicos);

// Rotas de usuários
router.post("/users/register", controllerUser.Inserir);
router.post("/users/login", controllerUser.Login);
router.get("/users/profile", jwt.ValidateToken, controllerUser.Profile);

// Rotas de agendamentos
router.get("/appointments", jwt.ValidateToken, controllerAppointment.ListarByUser);
router.post("/appointments", jwt.ValidateToken, controllerAppointment.Inserir);
router.delete("/appointments/:id_appointment", jwt.ValidateToken, controllerAppointment.Excluir);

// Rota para verificar disponibilidade (pode ser acessada sem autenticação)
router.get("/appointments/availability", controllerAppointment.VerificarDisponibilidade);

// Rotas para bloquear/desbloquear dias
router.post("/appointments/block-day", jwt.ValidateToken, controllerAppointment.BloquearDia);
router.post("/appointments/unblock-day", jwt.ValidateToken, controllerAppointment.DesbloquearDia);

// Rotas de admin
router.post("/admin/register", controllerUser.InserirAdmin);
router.post("/admin/login", controllerUser.LoginAdmin);
router.get("/admin/appointments", jwt.ValidateToken, controllerAppointment.Listar);
router.get('/admin/users', jwt.ValidateToken, controllerUser.Listar); 
router.get('/admin/appointments/:id_appointment', jwt.ValidateToken, controllerAppointment.ListarId); 
router.post('/admin/appointments', jwt.ValidateToken, controllerAppointment.InserirAdmin); 
router.put('/admin/appointments/:id_appointment', jwt.ValidateToken, controllerAppointment.EditarAdmin);

export default router;