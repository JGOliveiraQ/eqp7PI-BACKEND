import mongoose from "mongoose";
import dotenv from "dotenv";
import Clinica from "../models/Clinica.js";
import Profissional from "../models/Profissional.js";
import Paciente from "../models/Paciente.js";
import Agendamento from "../models/Agendamento.js";

dotenv.config();

const clinicasRecife = [
  {
    nome: "Clínica da Atenção Primária Boa Viagem",
    endereco: "Avenida Boa Viagem, 2000",
    bairro: "Boa Viagem",
    cidade: "Recife",
    telefone: "(81) 3322-1100"
  },
  {
    nome: "Centro Médico São José",
    endereco: "Rua da Aurora, 315",
    bairro: "Santo Amaro",
    cidade: "Recife",
    telefone: "(81) 3421-8800"
  },
  {
    nome: "Hospital Municipal do Derby",
    endereco: "Avenida Santos Dumont, 730",
    bairro: "Derby",
    cidade: "Recife",
    telefone: "(81) 3244-2300"
  }
];

const medicosBase = [
  {
    nome: "Dr. João Pereira",
    crm: "PE123456",
    especialidade: "Cardiologia",
    bio: "Especialista em prevenção cardiovascular e acompanhamento de idosos.",
    avaliacao: 4.9,
    totalAvaliacoes: 128,
    fotoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
    atendeTelemedicina: true
  },
  {
    nome: "Dra. Marina Nunes",
    crm: "PE234567",
    especialidade: "Endocrinologia",
    bio: "Atendimento focado em diabetes, pressão arterial e qualidade de vida.",
    avaliacao: 4.8,
    totalAvaliacoes: 96,
    fotoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
    atendeTelemedicina: true
  },
  {
    nome: "Dr. Carlos Almeida",
    crm: "PE345678",
    especialidade: "Ortopedia",
    bio: "Tratamento de dores articulares e mobilidade para pacientes da terceira idade.",
    avaliacao: 4.7,
    totalAvaliacoes: 87,
    fotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    atendeTelemedicina: false
  },
  {
    nome: "Dra. Fernanda Costa",
    crm: "PE456789",
    especialidade: "Oftalmologia",
    bio: "Especialista em visão, catarata e cuidados com a saúde ocular.",
    avaliacao: 4.9,
    totalAvaliacoes: 110,
    fotoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
    atendeTelemedicina: true
  },
  {
    nome: "Dr. Eduardo Ramos",
    crm: "PE567890",
    especialidade: "Neurologia",
    bio: "Acompanhamento clínico para memória, sono e sintomas neurológicos.",
    avaliacao: 4.8,
    totalAvaliacoes: 104,
    fotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    atendeTelemedicina: false
  }
];

const criarAgendaBase = (profissionalId, clinicaId) => {
  const hoje = new Date();
  const slots = [];

  for (let dia = 1; dia <= 10; dia += 1) {
    const base = new Date(hoje);
    base.setDate(hoje.getDate() + dia);

    [9, 11, 14, 16].forEach((hora) => {
      const data = new Date(base);
      data.setHours(hora, 0, 0, 0);
      slots.push({
        profissionalId,
        clinicaId,
        pacienteId: null,
        dataHora: data,
        tipo: hora >= 14 ? "Telemedicina" : "Presencial",
        status: "Confirmado",
        instrucoes: "Horário de rotina de avaliação"
      });
    });
  }

  return slots;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao MongoDB para popular dados iniciais.");

    await Paciente.deleteMany({});
    await Agendamento.deleteMany({});
    await Profissional.deleteMany({});
    await Clinica.deleteMany({});

    const clinicasCriadas = await Clinica.insertMany(clinicasRecife);

    const profissionaisCriados = await Promise.all(
      medicosBase.map((medico, index) => {
        const clinicaId = clinicasCriadas[index % clinicasCriadas.length]._id;

        return Profissional.create({
          ...medico,
          clinicaId
        });
      })
    );

    const pacienteDemo = await Paciente.create({
      nome: "Maria da Silva",
      cpf: "12345678909",
      email: "maria@sauderecife.com",
      senha: "$2a$10$0h5mQ4wDTVW4NLEpD3qjNOICs1GJq2nD0Y.0V7w0g5b4w7eN7lWBy",
      dataNascimento: new Date("1965-08-27"),
      telefone: "(81) 99876-5432",
      tipo: "PACIENTE"
    });

    const agendamentos = [];
    profissionaisCriados.forEach((profissional, index) => {
      const slots = criarAgendaBase(profissional._id, profissional.clinicaId);
      const slotSelecionado = slots[Math.min(index, slots.length - 1)];

      agendamentos.push({
        ...slotSelecionado,
        pacienteId: pacienteDemo._id,
        status: "Confirmado",
        instrucoes: "Consulta de rotina para avaliação geral."
      });
    });

    await Agendamento.insertMany(agendamentos);

    console.log(`Seed concluído com sucesso: ${clinicasCriadas.length} clínicas, ${profissionaisCriados.length} profissionais e ${agendamentos.length} agendamentos iniciais.`);
    process.exit(0);
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  }
};

seedDatabase();
