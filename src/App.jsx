import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Correcao from "./pages/Correcao";

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/correcao"
          element={<Correcao />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;