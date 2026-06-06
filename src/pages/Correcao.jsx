import { useState } from "react";
import { createPortal } from "react-dom";

import UploadImagem from "../components/UploadImagem";
import Notification from "../components/Notification";
import ChatBotWidget from "../components/ChatBot";

import "../styles/Correcao.css";

export default function Correcao() {
  const [pergunta, setPergunta] = useState("");
  const [respostaAluno, setRespostaAluno] = useState("");
  const [gabarito, setGabarito] = useState("");
  const [resultado, setResultado] = useState("");
  const [promptGerado, setPromptGerado] = useState("");
  const [notificacao, setNotificacao] = useState("");

  function mostrarNotificacao(mensagem) {
    setNotificacao(mensagem);
    setTimeout(() => {
      setNotificacao("");
    }, 3000);
  }
  
  function gerarPromptTexto() {
    let respostaFinal = respostaAluno;
    if (gabarito.trim() !== "") {
      respostaFinal += `\n\nGabarito / Palavras-chave esperadas: ${gabarito}`;
    }
    return `
Considere a seguinte questão:

${pergunta}

Verifique o percentual de acerto da seguinte resposta:

${respostaFinal}

Explique o motivo da porcentagem
e coloque referências bibliográficas.
    `;
  }

  function handleGerarPrompt() {
    if (!pergunta.trim() || !respostaAluno.trim()) {
      mostrarNotificacao("Preencha a pergunta e resposta.");
      return;
    }
    const prompt = gerarPromptTexto();
    setPromptGerado(prompt);
    mostrarNotificacao("Prompt gerado com sucesso!");
  }

  async function handleQuestionSubmit() {
    let respostaFinal = respostaAluno;
    if (gabarito.trim() !== "") {
      respostaFinal += `\n\nGabarito / Palavras-chave esperadas: ${gabarito}`;
    }
    if (!pergunta.trim() || !respostaAluno.trim()) {
      mostrarNotificacao("Preencha a pergunta e a resposta do aluno.");
      return;
    }
    try {
      setResultado("Carregando...");

      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(
        `${baseUrl}/corrigir`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pergunta,
            resposta: respostaFinal,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();
      setResultado(data.correction);
      mostrarNotificacao("Correção gerada com sucesso!");
    } catch (error) {
      console.error(error);
      setResultado("Erro ao obter resposta.");
      mostrarNotificacao("Erro ao gerar correção.");
    }
  }

  return (
    <>
      <div className="correcao-page">

        <Notification mensagem={notificacao} />

        <section className="hero-section">
          <span className="badge">
            📘 Módulo para Correção de Questões
          </span>
          <h1 className="titulo">
            Correção de Questões Descritivas
          </h1>
          <p className="subtitulo">
            Utilize inteligência artificial para analisar
            e avaliar respostas de forma precisa,
            objetiva e construtiva.
          </p>
        </section>

        <div className="correcao-grid">

          {/* ESQUERDA */}
          <section className="container-card">
            <h2 className="section-title">Questões / Respostas</h2>
            <p className="section-subtitle">Insira os dados da questão para correção</p>

            <div className="form-group">
              <label>Questão</label>
              <textarea
                rows={6}
                placeholder="Digite ou cole o enunciado da questão aqui..."
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Resposta do Aluno</label>
              <textarea
                rows={6}
                placeholder="Digite a resposta fornecida pelo aluno..."
                value={respostaAluno}
                onChange={(e) => setRespostaAluno(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Gabarito / Palavras-chave esperadas</label>
              <textarea
                rows={5}
                placeholder="Digite o gabarito esperado aqui..."
                value={gabarito}
                onChange={(e) => setGabarito(e.target.value)}
              />
            </div>

            <UploadImagem
              setPergunta={setPergunta}
              setRespostaAluno={setRespostaAluno}
              setResultado={setResultado}
            />

            <button className="btn-primary" onClick={handleGerarPrompt}>
              Gerar Prompt
            </button>
          </section>

          {/* DIREITA */}
          <section className="container-card">
            <h2 className="section-title">Chat Corretor (IA)</h2>
            <p className="section-subtitle">Assistente inteligente de correção</p>

            <div className="form-group">
              <label>Cole o prompt gerado</label>
              <textarea
                rows={6}
                placeholder="Cole aqui o prompt gerado"
                value={promptGerado}
                onChange={(e) => setPromptGerado(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Resposta da IA</label>
              <textarea
                rows={8}
                placeholder="A resposta da IA aparecerá aqui..."
                value={resultado}
                readOnly
              />
            </div>

            <button className="btn-primary" onClick={handleQuestionSubmit}>
              Enviar Pergunta
            </button>
          </section>

        </div>
      </div>

      {createPortal(<ChatBotWidget />, document.body)}
    </>
  );
}