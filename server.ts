import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 1. Chat with Personal Trainer IA
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, userProfile, historySummary, currentSplit } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória.' });
    }

    const systemInstruction = `
Você é o IRONFLOW Personal Trainer IA — um treinador e especialista em biomecânica da musculação de elite.
Seu objetivo é orientar o usuário sobre técnica, periodização, descanso, progressão de carga e motivação.

DIRETRIZES FUNDAMENTAIS:
1. Idioma: Português do Brasil (PT-BR), tom atlético, profissional, direto e encorajador.
2. BASEIE-SE ESTRITAMENTE NOS DADOS REAIS DO USUÁRIO informados abaixo. Nunca invente treinos que ele não fez.
3. Se o usuário relatar dor nas articulações ou desconforto anormal, recomende pausar o exercício, substitua por alternativas de menor estresse articular e recomende avaliação médica/fisioterapêutica. NUNCA faça diagnóstico médico.
4. NUNCA prescreva esteroides, hormônios, SARMs ou fármacos.
5. Quando sugerir substituição de exercícios, explique o benefício biomecânico e compatibilidade com equipamentos.
6. Seja conciso (parágrafos curtos ou bullet points legíveis em tela de celular durante o treino).

DADOS DO ATLETA:
- Nome: ${userProfile?.name || 'Atleta'}
- Objetivo: ${userProfile?.goal || 'Hipertrofia'}
- Nível: ${userProfile?.experienceLevel || 'Intermediário'}
- Divisão atual: ${currentSplit || 'ABCD'}
- Frequência: ${userProfile?.daysPerWeek || 4} dias/semana
- Equipamentos: ${userProfile?.availableEquipment?.join(', ') || 'Academia Completa'}
- Limitações informadas: ${userProfile?.injuries?.length ? userProfile.injuries.join(', ') : 'Nenhuma restrição'}
- Observações de saúde: ${userProfile?.limitationsNotes || 'Nenhuma'}
- Resumo do Histórico recente: ${historySummary || 'Iniciando programa de treino agora'}
`;

    if (!ai) {
      // Heuristic fallback if GEMINI_API_KEY is not set
      const lower = message.toLowerCase();
      let reply = '';
      if (lower.includes('ombro') || lower.includes('dor')) {
        reply = `⚠️ **Atenção à articulação do ombro:**\n\nSe houver dor ou pinçamento, suspenda imediatamente exercícios acima da cabeça com pegada muito aberta. Substitua o desenvolvimento por **Elevação Lateral na Polia** com rotação neutra ou **Face Pull**, que fortalecem o manguito rotador. Se persistir, consulte um fisioterapeuta esportivo.`;
      } else if (lower.includes('progredir') || lower.includes('carga') || lower.includes('supino')) {
        reply = `🔥 **Regra da Progressão Dupla IRONFLOW:**\n\nPara progredir com segurança no seu exercício:\n1. Mantenha a mesma carga até conseguir bater o teto de repetições (ex: 10 a 12 reps) em TODAS as séries.\n2. Quando fechar todas com RPE ≤ 8.5 e técnica perfeita, adicione de +1kg a +2.5kg na sessão seguinte.\n3. Volte para a base da faixa (8 reps) com a nova carga e repita o ciclo!`;
      } else if (lower.includes('substitu') || lower.includes('trocar')) {
        reply = `💪 **Substituição de Equipamento:**\n\nSe a máquina ou banco estiver ocupado, busque um exercício com curva de resistência similar:\n- **Supino Barra** ➡️ **Supino Reto com Halteres** ou **Peck Deck**.\n- **Puxada Alta** ➡️ **Barra Fixa com elástico** ou **Puxada no Triângulo**.\n- **Agachamento Livre** ➡️ **Leg Press 45º** ou **Agachamento Hack**.`;
      } else {
        reply = `Fala ${userProfile?.name || 'atleta'}! Analisando seu perfil de **${userProfile?.goal || 'hipertrofia'}** na divisão **${currentSplit || 'ABCD'}**, o segredo está na consistência e na sobrecarga progressiva respeitando o descanso de 60s a 120s entre séries. Em que posso te ajudar especificamente no treino de hoje?`;
      }

      return res.json({ reply });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: systemInstruction + `\n\nPergunta do usuário: ${message}` }] }
      ]
    });

    const reply = response.text || 'Entendido! Foque na técnica correta e no descanso entre séries.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Erro na rota /api/gemini/chat:', error);
    return res.status(500).json({
      error: 'Não foi possível processar a consulta com o Personal IA no momento.',
      details: error?.message
    });
  }
});

// 2. Generate Intelligent Custom Workout Routine
app.post('/api/gemini/generate-workout', async (req: Request, res: Response) => {
  try {
    const { userProfile } = req.body;

    const prompt = `
Gere uma ficha de treino individualizada para este atleta em formato JSON estrito:
- Objetivo: ${userProfile?.goal || 'Hipertrofia'}
- Nível: ${userProfile?.experienceLevel || 'Intermediário'}
- Dias/semana: ${userProfile?.daysPerWeek || 4}
- Duração da sessão: ${userProfile?.sessionDurationMinutes || 60} minutos
- Local/equipamentos: ${userProfile?.gymType || 'academia_completa'} (${userProfile?.availableEquipment?.join(', ') || 'tudo'})
- Lesões/restrições: ${userProfile?.injuries?.join(', ') || 'Nenhuma'}
- Divisão desejada: ${userProfile?.preferredSplit || 'ABCD'}

Retorne APENAS um objeto JSON com o formato:
{
  "name": "Nome do Programa",
  "splitType": "${userProfile?.preferredSplit || 'ABCD'}",
  "description": "Breve justificativa técnica do programa",
  "routines": [
    {
      "name": "Treino A — Peito & Tríceps",
      "tag": "A",
      "splitType": "${userProfile?.preferredSplit || 'ABCD'}",
      "description": "Foco...",
      "targetMuscles": ["Peito", "Tríceps"],
      "exercises": [
        {
          "exerciseId": "supino_reto_barra",
          "exerciseName": "Supino Reto com Barra",
          "targetSets": 4,
          "repRange": "8-10",
          "suggestedLoadKg": 40,
          "restSeconds": 90,
          "notes": "Instrução técnica",
          "alternatives": ["supino_inclinado_halteres"]
        }
      ]
    }
  ]
}
Não inclua crases de markdown além do bloco json.
`;

    if (!ai) {
      return res.status(503).json({ error: 'IA não configurada no servidor. Use os modelos pré-definidos.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const json = JSON.parse(text);
    return res.json(json);
  } catch (error: any) {
    console.error('Erro na geração de treino:', error);
    return res.status(500).json({ error: 'Falha ao gerar treino com IA.', details: error?.message });
  }
});

// 3. Weekly Evolution & Load Analysis
app.post('/api/gemini/analyze-progress', async (req: Request, res: Response) => {
  try {
    const { sessions, userProfile } = req.body;

    const prompt = `
Analise o desempenho e a progressão de cargas deste atleta nos últimos treinos:
Atleta: ${userProfile?.name}, Objetivo: ${userProfile?.goal}
Treinos realizados: ${JSON.stringify(sessions?.slice(0, 5) || [])}

Forneça um feedback semanal dividido em:
1. 📈 **Destaques de Evolução** (cargas aumentadas, repetições batidas)
2. ⚠️ **Pontos de Atenção & Recuperação** (onde houve fadiga ou estagnação)
3. 🎯 **Próximo Passo Recomendado** (metas concretas para a próxima semana)

Responda em tom técnico e motivador em Português.
`;

    if (!ai) {
      return res.json({
        analysis: `### 📈 Destaques da Semana\n- Ótima aderência aos treinos programados!\n- Volume de treino consistente com ${sessions?.length || 0} sessões registradas.\n\n### 🎯 Próximo Passo\n- Mantenha a regra de progressão dupla nos exercícios principais antes de subir peso.`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    return res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Erro na análise de progresso:', error);
    return res.status(500).json({ error: 'Falha ao analisar progresso.', details: error?.message });
  }
});

// Setup Vite or Static File serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IRONFLOW server running on port ${PORT}`);
  });
}

startServer();
