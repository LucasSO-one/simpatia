// importando bibliotecas
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {GoogleGenerativeAI} = require('@google/generative-ai');

app = express();
const port = 3000;
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

app.use(cors());
app.use(express.json());

app.post('/corrigir', async(req, res) => {
    try{
        const {question} = req.body;

        if(!question){
            return res.status(400).json({error: "Question is required"});
        }

        const model = genAI.getGenerativeModel({model:"gemini-1.5-flash-latest"});
        const result = await model.generateContent(question);
        const response = await result.response.text();

        res.json({correction: response});

    }catch(err){
        console.error("ERRO DETALHADO NO SERVIDOR:", err); 
        return res.status(500).json({error: "Internal Server Error"})
    }
});

app.listen(port, () =>{
    console.log(`Server running on http://localhost:${port}`);
})