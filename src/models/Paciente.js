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
    dadosSaude: {
      condicoesConhecidas: {
        type: [String],
        default: []
      },
      situacaoCondicoes: {
        type: String,
        enum: ["informadas", "nenhuma_listada", "nao_sei", "nao_informado"],
        default: "nao_informado"
      },
      outraCondicao: {
        type: String,
        trim: true,
        maxlength: 120,
        default: ""
      },
      usoMedicacaoContinua: {
        type: String,
        enum: ["sim", "nao", "nao_sei", "nao_informado"],
        default: "nao_informado"
      },
      alergiasMedicamentos: {
        type: String,
        enum: ["sim", "nao", "nao_sei", "nao_informado"],
        default: "nao_informado"
      },
      consentimentoArmazenamento: {
        type: Boolean,
        default: false
      },
      consentimentoArmazenamentoEm: {
        type: Date
      }
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
  delete paciente.dadosSaude;
  return paciente;
};

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;

