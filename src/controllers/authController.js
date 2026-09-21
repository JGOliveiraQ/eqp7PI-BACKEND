import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Paciente from "../models/Paciente.js";

const gerarToken = (paciente) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não configurado no ambiente.");
  }

  return jwt.sign(
    {
      pacienteId: paciente._id,
      email: paciente.email,
      tipo: paciente.tipo
    },
    secret,
    { expiresIn: "7d" }
  );
};

const normalizarCpf = (valor = "") => valor.replace(/\D/g, "");

const cpfEhValido = (cpf) => {
  const cpfLimpo = normalizarCpf(cpf);

  if (!cpfLimpo || cpfLimpo.length !== 11 || /^([0-9])\1+$/.test(cpfLimpo)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i += 1) {
    soma += Number(cpfLimpo.charAt(i)) * (10 - i);
  }

  let primeiroDigito = 11 - (soma % 11);
  if (primeiroDigito >= 10) {
    primeiroDigito = 0;
  }

  if (Number(cpfLimpo.charAt(9)) !== primeiroDigito) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i += 1) {
    soma += Number(cpfLimpo.charAt(i)) * (11 - i);
  }

  let segundoDigito = 11 - (soma % 11);
  if (segundoDigito >= 10) {
    segundoDigito = 0;
  }

  return Number(cpfLimpo.charAt(10)) === segundoDigito;
};

export const cadastrarPaciente = async (req, res, next) => {
  try {
    const {
      nome,
      cpf,
      email,
      senha,
      dataNascimento,
      telefone,
      fotoUrl
    } = req.body;

    if (!nome || !cpf || !email || !senha) {
      return res.status(400).json({
        message: "nome, cpf, email e senha são obrigatórios."
      });
    }

    const cpfNormalizado = normalizarCpf(cpf);

    if (!cpfEhValido(cpfNormalizado)) {
      return res.status(400).json({ message: "CPF inválido." });
    }

    const emailNormalizado = String(email).trim().toLowerCase();

    const pacienteExistente = await Paciente.findOne({
      $or: [
        { cpf: cpfNormalizado },
        { email: emailNormalizado }
      ]
    });

    if (pacienteExistente) {
      const motivo = pacienteExistente.email === emailNormalizado ? "E-mail já cadastrado." : "CPF já cadastrado.";
      return res.status(409).json({ message: motivo });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const paciente = await Paciente.create({
      nome: String(nome).trim(),
      cpf: cpfNormalizado,
      email: emailNormalizado,
      senha: senhaHash,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
      telefone: telefone ? String(telefone).trim() : "",
      fotoUrl: fotoUrl || "",
      tipo: "PACIENTE"
    });

    const token = gerarToken(paciente);

    return res.status(201).json({
      message: "Paciente cadastrado com sucesso.",
      token,
      usuario: paciente.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

export const loginPaciente = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        message: "email e senha são obrigatórios."
      });
    }

    const paciente = await Paciente.findOne({
      email: String(email).trim().toLowerCase()
    });

    if (!paciente) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(String(senha), paciente.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = gerarToken(paciente);

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      token,
      usuario: paciente.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

export const obterPerfilPaciente = async (req, res, next) => {
  try {
    const paciente = await Paciente.findById(req.usuario.pacienteId).select("-senha");

    if (!paciente) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    return res.status(200).json({ usuario: paciente.toObject() });
  } catch (error) {
    next(error);
  }
};

export const atualizarPerfilPaciente = async (req, res, next) => {
  try {
    const paciente = await Paciente.findById(req.usuario.pacienteId);

    if (!paciente) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    const camposPermitidos = [
      "nome",
      "telefone",
      "dataNascimento",
      "fotoUrl"
    ];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        paciente[campo] = req.body[campo];
      }
    });

    if (req.body.senha) {
      paciente.senha = await bcrypt.hash(String(req.body.senha), 10);
    }

    await paciente.save();

    return res.status(200).json({
      message: "Perfil atualizado com sucesso.",
      usuario: paciente.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};
