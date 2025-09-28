require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Correção: usar o pacote correto
const { GoogleGenerativeAI } = require("@google/generative-ai"); 

const app = express();
const port = 3000;
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

app.use(cors());
app.use(express.json());

app.post('/corrigir', async (req, res) => {
    try {
        const { pergunta, resposta } = req.body;

        if (!pergunta || !resposta) {
            return res.status(400).json({ error: "A pergunta e a resposta são obrigatórias." });
        }

        const prompt = `Você é um assistente de professor avaliando uma questão.\n\n**Questão Original:** "${pergunta}"\n\n**Resposta do Aluno:** "${resposta}"\n\n**Sua tarefa é:**\n1. Avaliar o percentual de acerto da resposta do aluno.\n2. Listar os pontos fortes da resposta.\n3. Apontar os pontos fracos ou o que faltou para a resposta ser completa.\n\n**Análise:**`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ correction: text });

    } catch (err) {
        console.error("ERRO DETALHADO NO SERVIDOR:", err);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});