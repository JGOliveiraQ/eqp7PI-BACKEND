import Profissional from "../models/Profissional.js";
import Agendamento from "../models/Agendamento.js";

const gerarAgendaDisponivel = () => {
  const hoje = new Date();
  const slots = [];

  for (let dia = 1; dia <= 5; dia += 1) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + dia);

    [9, 11, 14, 16, 18].forEach((hora) => {
      const slot = new Date(data);
      slot.setHours(hora, 0, 0, 0);
      slots.push(slot.toISOString());
    });
  }

  return slots;
};

export const listarMedicos = async (req, res) => {
    const { especialidade, busca, atendeTelemedicina } = req.query;
    const filtro = {};

    if (especialidade) {
      filtro.especialidade = { $regex: especialidade, $options: "i" };
    }

    if (busca) {
      filtro.$or = [
        { nome: { $regex: busca, $options: "i" } },
        { especialidade: { $regex: busca, $options: "i" } }
      ];
    }

    if (atendeTelemedicina !== undefined) {
      filtro.atendeTelemedicina = atendeTelemedicina === "true";
    }

    const medicos = await Profissional.find(filtro)
      .populate({
        path: "clinicaId",
        select: "nome endereco bairro cidade telefone"
      })
      .sort({ nome: 1 });

    return res.status(200).json({
      total: medicos.length,
      dados: medicos.map((medico) => ({
        ...medico.toObject(),
        agendaDisponivel: gerarAgendaDisponivel()
      }))
    });
};

export const listarEspecialidades = async (req, res) => {
    const especialidades = await Profissional.aggregate([
      { $group: { _id: "$especialidade", total: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      total: especialidades.length,
      dados: especialidades.map((item) => ({
        especialidade: item._id,
        totalMedicos: item.total
      }))
    });
};

export const obterDetalhesMedico = async (req, res) => {
    const { id } = req.params;

    const profissional = await Profissional.findById(id).populate({
      path: "clinicaId",
      select: "nome endereco bairro cidade telefone"
    });

    if (!profissional) {
      return res.status(404).json({ message: "Médico não encontrado." });
    }

    const agenda = await Agendamento.find({
      profissionalId: id,
      dataHora: { $gte: new Date() },
      status: { $ne: "Cancelado" }
    })
      .select("dataHora status pacienteId")
      .sort({ dataHora: 1 })
      .limit(10);

    return res.status(200).json({
      profissional,
      agenda,
      agendaDisponivel: gerarAgendaDisponivel()
    });
};
