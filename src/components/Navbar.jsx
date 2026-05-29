import { Link } from "react-router-dom";

import "../styles/Navbar.css";

export default function Navbar() {

  return (

    <header className="navbar">

      {/* ESQUERDA */}

      <Link
        to="/"
        className="navbar-logo"
      >
        <img
          src="/img/logo-simpatia.svg"
          alt="Logo Simpatia"
        />
      </Link>

      {/* DIREITA */}

      <nav className="navbar-links">

        <Link to="/">
          Início
        </Link>

        <Link to="/correcao">
          Correção de Questões
        </Link>

      </nav>

    </header>
  );
}