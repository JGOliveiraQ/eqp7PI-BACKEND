import mongoose from "mongoose";
import "./Paciente.js";
import "./Profissional.js";
import "./Clinica.js";

const agendamentoSchema = new mongoose.Schema(
  {
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
    tipo: {
      type: String,
      enum: ["Presencial", "Telemedicina"],
      default: "Presencial"
    },
    status: {
      type: String,
      enum: ["Confirmado", "Concluido", "Cancelado"],
      default: "Confirmado"
    },
    instrucoes: {
      type: String,
      default: "",
      trim: true
    },
    criadoEm: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

agendamentoSchema.index({ profissionalId: 1, dataHora: 1 }, { unique: true });

const Agendamento = mongoose.model("Agendamento", agendamentoSchema);

export default Agendamento;

