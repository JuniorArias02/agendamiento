import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import Agenda from "./components/pages/Agenda";
import ConfirmarAgenda from "./components/pages/Confirmar";
import Login from "./components/pages/Login";
import VerificarCuenta from "./components/pages/VerificarCuenta";
import VerificarCodigo from "./components/pages/VerificarCodigo";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider> {/* 👈 envolvés todo en el proveedor */}
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/agenda" element={<Layout><Agenda /></Layout>} />
          <Route path="/agenda/confirmar" element={<Layout><ConfirmarAgenda /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/verificar_cuenta" element={<Layout><VerificarCuenta /></Layout>} />
          <Route path="/verificar_codigo" element={<Layout><VerificarCodigo /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
