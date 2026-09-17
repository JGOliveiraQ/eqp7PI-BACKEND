import mongoose from "mongoose";

const agendamentoSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
    required: true
  },
  profissionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profissional",
    required: true
  },
  clinicaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinica",
    required: true
  },
  dataHora: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["CONFIRMADO", "CANCELADO"],
    default: "CONFIRMADO"
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

agendamentoSchema.index({ profissionalId: 1, dataHora: 1 }, { unique: true });

const Agendamento = mongoose.model("Agendamento", agendamentoSchema);

export default Agendamento;

