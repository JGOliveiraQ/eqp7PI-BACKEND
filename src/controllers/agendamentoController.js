import Agendamento from "../models/Agendamento.js";

const obterPacienteId = (req) => req.usuario?.pacienteId || req.usuario?._id || req.usuario?.id;

const validarDataFutura = (dataHora) => {
  const data = new Date(dataHora);

  if (Number.isNaN(data.getTime())) {
    return { valido: false, mensagem: "Data e hora inválidas." };
  }

  if (data <= new Date()) {
    return { valido: false, mensagem: "A data e hora do agendamento devem ser futuras." };
  }

  return { valido: true, data };
};

export const criarAgendamento = async (req, res) => {
  try {
    const pacienteId = obterPacienteId(req);

    if (!pacienteId) {
      return res.status(401).json({ message: "Paciente não identificado no token de autenticação." });
    }

    const { profissionalId, clinicaId, dataHora, tipo, instrucoes } = req.body;

    if (!profissionalId || !clinicaId || !dataHora) {
      return res.status(400).json({ message: "profissionalId, clinicaId e dataHora são obrigatórios." });
    }

    const validacao = validarDataFutura(dataHora);
    if (!validacao.valido) {
      return res.status(400).json({ message: validacao.mensagem });
    }

    const existeConflito = await Agendamento.exists({
      profissionalId,
      dataHora: validacao.data,
      status: { $ne: "Cancelado" }
    });

    if (existeConflito) {
      return res.status(409).json({
        message: "Este horário não está mais disponível para este profissional."
      });
    }

    const agendamento = await Agendamento.create({
      pacienteId,
      profissionalId,
      clinicaId,
      dataHora: validacao.data,
      tipo: tipo || "Presencial",
      instrucoes: instrucoes || "",
      status: "Confirmado"
    });

    return res.status(201).json(agendamento);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Este horário não está mais disponível para este profissional."
      });
    }
    throw error;
  }
};

export const listarAgendamentosPaciente = async (req, res) => {
    const pacienteId = obterPacienteId(req);

    if (!pacienteId) {
      return res.status(401).json({ message: "Paciente não identificado no token de autenticação." });
    }

    const { filtro } = req.query;
    const query = { pacienteId };
    const agora = new Date();

    if (filtro === "proximos") {
      query.dataHora = { $gte: agora };
    }

    if (filtro === "historico") {
      query.dataHora = { $lt: agora };
    }

    const agendamentos = await Agendamento.find(query)
      .populate("profissionalId", "nome especialidade crm fotoUrl")
      .populate("clinicaId", "nome endereco bairro cidade telefone")
      .sort({ dataHora: filtro === "historico" ? -1 : 1 });

    return res.status(200).json(agendamentos);
};

export const reagendarAgendamento = async (req, res) => {
    const pacienteId = obterPacienteId(req);
    const { id } = req.params;
    const { dataHora, tipo, instrucoes } = req.body;

    if (!dataHora) {
      return res.status(400).json({ message: "A nova dataHora é obrigatória." });
    }

    const agendamento = await Agendamento.findOne({ _id: id, pacienteId });

    if (!agendamento) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    if (agendamento.status === "Cancelado") {
      return res.status(400).json({ message: "Não é possível reagendar um agendamento cancelado." });
    }

    const validacao = validarDataFutura(dataHora);
    if (!validacao.valido) {
      return res.status(400).json({ message: validacao.mensagem });
    }

    const conflito = await Agendamento.exists({
      profissionalId: agendamento.profissionalId,
      dataHora: validacao.data,
      _id: { $ne: agendamento._id },
      status: { $ne: "Cancelado" }
    });

    if (conflito) {
      return res.status(409).json({ message: "Novo horário indisponível para este profissional." });
    }

    agendamento.dataHora = validacao.data;
    agendamento.tipo = tipo || agendamento.tipo;
    agendamento.instrucoes = instrucoes ?? agendamento.instrucoes;
    await agendamento.save();

    return res.status(200).json({ message: "Agendamento reagendado com sucesso.", agendamento });
};

export const cancelarAgendamento = async (req, res) => {
    const pacienteId = obterPacienteId(req);
    const { id } = req.params;

    const agendamento = await Agendamento.findOne({ _id: id, pacienteId });

    if (!agendamento) {
      return res.status(404).json({ message: "Agendamento não encontrado." });
    }

    if (agendamento.status === "Cancelado") {
      return res.status(400).json({ message: "Este agendamento já está cancelado." });
    }

    agendamento.status = "Cancelado";
    await agendamento.save();

    return res.status(200).json({
      message: "Agendamento cancelado com sucesso.",
      agendamento
    });
};

