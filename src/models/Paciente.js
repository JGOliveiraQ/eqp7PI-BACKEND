import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: (valor) => String(valor).replace(/\D/g, "")
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    senha: {
      type: String,
      required: true
    },
    dataNascimento: {
      type: Date
    },
    telefone: {
      type: String,
      trim: true,
      default: ""
    },
    fotoUrl: {
      type: String,
      default: ""
    },
    tipo: {
      type: String,
      enum: ["PACIENTE"],
      default: "PACIENTE"
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

pacienteSchema.methods.toPublicJSON = function toPublicJSON() {
  const paciente = this.toObject();
  delete paciente.senha;
  return paciente;
};

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;

