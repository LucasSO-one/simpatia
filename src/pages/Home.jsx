import { Link } from "react-router-dom";

import "../styles/Home.css";

export default function Home() {

  return (

    <div className="home-page">

      <div className="home-overlay"></div>

      <main className="home-container">

        <span className="home-badge">
          📘 Plataforma Educacional com IA
        </span>

        <h1 className="home-title">
          SIMPATIA
        </h1>

        <p className="home-subtitle">
          Sistema inteligente para correção
          de questões descritivas utilizando
          inteligência artificial para auxiliar
          professores e instituições de ensino.
        </p>

        <div className="home-buttons">

          <Link
            to="/correcao"
            className="btn-primary-home"
          >
            Entrar no módulo de Correção
          </Link>

        </div>

        <div className="home-info-grid">

          <div className="info-card">

            <h3>
              ⚡ Correção Inteligente
            </h3>

            <p>
              Analise respostas automaticamente
              com apoio de IA.
            </p>

          </div>

          <div className="info-card">

            <h3>
              📄 Upload de Imagens
            </h3>

            <p>
              Extraia questões e respostas
              diretamente de imagens.
            </p>

          </div>

          <div className="info-card">

            <h3>
              🎯 Feedback Didático
            </h3>

            <p>
              Gere avaliações construtivas
              e objetivas rapidamente.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}