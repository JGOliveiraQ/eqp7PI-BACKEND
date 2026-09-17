import Agendamento from "../models/Agendamento.js";

export const criarAgendamento = async (req, res, next) => {
  try {
    const pacienteId = req.usuario?.pacienteId || req.usuario?._id || req.usuario?.id;

    if (!pacienteId) {
      return res.status(401).json({ message: "Paciente não identificado no token de autenticação." });
    }

    const { profissionalId, clinicaId, dataHora } = req.body;

    if (!profissionalId || !clinicaId || !dataHora) {
      return res.status(400).json({ message: "profissionalId, clinicaId e dataHora são obrigatórios." });
    }

    const dataAgendamento = new Date(dataHora);

    if (Number.isNaN(dataAgendamento.getTime())) {
      return res.status(400).json({ message: "Data e hora inválidas." });
    }

    if (dataAgendamento <= new Date()) {
      return res.status(400).json({ message: "A data e hora do agendamento devem ser futuras." });
    }

    const agendamentoExistente = await Agendamento.findOne({
      profissionalId,
      dataHora: dataAgendamento,
      status: "CONFIRMADO"
    });

    if (agendamentoExistente) {
      return res.status(409).json({
        message: "Este horário não está mais disponível para este profissional."
      });
    }

    const agendamento = await Agendamento.create({
      pacienteId,
      profissionalId,
      clinicaId,
      dataHora: dataAgendamento,
      status: "CONFIRMADO"
    });

    return res.status(201).json(agendamento);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Este horário não está mais disponível para este profissional."
      });
    }
    next(error);
  }
};

export const listarAgendamentosPaciente = async (req, res, next) => {
  try {
    const pacienteId = req.usuario?.pacienteId || req.usuario?._id || req.usuario?.id;

    if (!pacienteId) {
      return res.status(401).json({ message: "Paciente não identificado no token de autenticação." });
    }

    const agendamentos = await Agendamento.find({ pacienteId }).sort({ dataHora: -1 });

    return res.status(200).json(agendamentos);
  } catch (error) {
    next(error);
  }
};

