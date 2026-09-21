import mongoose from "mongoose";
import "./Clinica.js";

const profissionalSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    crm: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    especialidade: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      default: "",
      trim: true
    },
    avaliacao: {
      type: Number,
      default: 5.0
    },
    totalAvaliacoes: {
      type: Number,
      default: 0
    },
    fotoUrl: {
      type: String,
      default: ""
    },
    clinicaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinica",
      required: true
    },
    atendeTelemedicina: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false
  }
);

const Profissional = mongoose.model("Profissional", profissionalSchema);

export default Profissional;

