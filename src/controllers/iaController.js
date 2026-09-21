import { GoogleGenAI } from "@google/genai";

const extrairTextoModelo = (response) => {
  if (typeof response?.text === "string" && response.text.trim()) {
    return response.text;
  }

  const texto = response?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text)
    .filter(Boolean)
    .join("\n");

  return texto?.trim() || "";
};

const limparJsonTexto = (texto) => {
  if (!texto) return "{}";

  const textoSemFences = texto.replace(/```json|```/gi, "").trim();
  const indiceInicial = textoSemFences.indexOf("{");
  const indiceFinal = textoSemFences.lastIndexOf("}");

  if (indiceInicial !== -1 && indiceFinal !== -1 && indiceFinal > indiceInicial) {
    return textoSemFences.slice(indiceInicial, indiceFinal + 1);
  }

  return textoSemFences;
};

export const triagemIa = async (req, res, next) => {
  try {
    const { queixa } = req.body || {};

    if (!queixa || !String(queixa).trim()) {
      return res.status(400).json({
        message: "O campo 'queixa' é obrigatório."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: "GEMINI_API_KEY não configurada no ambiente."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Você é um assistente clínico de triagem para idosos em Recife/PE.
Responda SOMENTE em JSON válido, sem markdown e sem texto extra.

Objetivo: interpretar uma queixa em linguagem popular e recomendar a especialidade médica mais adequada.

Instruções rígidas:
- Retorne um objeto JSON com exatamente estes campos:
  {
    "sintomasIdentificados": ["..."],
    "especialidadeRecomendada": "...",
    "observacoes": "...",
    "alertaEmergencia": true|false
  }
- sintomasIdentificados deve ser um array de strings curtas, em linguagem simples.
- especialidadeRecomendada deve ser uma especialidade médica clara, como Cardiologia, Neurologia, Ortopedia, Oftalmologia, Endocrinologia, Ginecologia, Urologia, Pneumologia, Geral ou Dermatologia.
- observacoes deve ser uma frase curta e útil para o paciente, em português do Brasil.
- alertaEmergencia deve ser true apenas em casos de urgência real (dor forte no peito, desmaio, falta de ar intensa, confusão forte, sangramento intenso, febre alta com piora brusca, dor intensa no abdômen, convulsão, dificuldade para falar ou andar).
- Se a queixa for leve ou comum, responda com alertaEmergencia false.
- Não invente sintomas que não existam na queixa.
- A queixa do paciente é: "${String(queixa).trim()}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt
    });

    const textoResposta = extrairTextoModelo(response);
    const jsonLimpo = limparJsonTexto(textoResposta);

    let resultado;
    try {
      resultado = JSON.parse(jsonLimpo);
    } catch {
      const fallback = {
        sintomasIdentificados: [String(queixa).trim()],
        especialidadeRecomendada: "Clínica Geral",
        observacoes: "A queixa foi registrada para avaliação médica. Procure atendimento conforme a gravidade dos sintomas.",
        alertaEmergencia: false
      };

      return res.status(200).json(fallback);
    }

    const payload = {
      sintomasIdentificados: Array.isArray(resultado.sintomasIdentificados) ? resultado.sintomasIdentificados : [String(queixa).trim()],
      especialidadeRecomendada: String(resultado.especialidadeRecomendada || "Clínica Geral").trim(),
      observacoes: String(resultado.observacoes || "A queixa foi registrada para avaliação médica.").trim(),
      alertaEmergencia: Boolean(resultado.alertaEmergencia)
    };

    return res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
