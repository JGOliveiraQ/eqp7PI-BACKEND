import mongoose from "mongoose";

const clinicaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },
    endereco: {
      type: String,
      required: true,
      trim: true
    },
    bairro: {
      type: String,
      required: true,
      trim: true
    },
    cidade: {
      type: String,
      default: "Recife",
      trim: true
    },
    telefone: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    versionKey: false
  }
);

const Clinica = mongoose.model("Clinica", clinicaSchema);

export default Clinica;

