import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";  // Asegúrate de importar Navigate
import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import Agenda from "./components/pages/Agenda";
import ConfirmarAgenda from "./components/pages/Confirmar";
import Login from "./components/pages/Login";
import VerificarCuenta from "./components/pages/VerificarCuenta";
import VerificarCodigo from "./components/pages/VerificarCodigo";
import TusCitas from "./components/pages/TusCitas";
import DetalleCita from "./components/pages/DetalleCita";
import { AuthProvider } from "./context/AuthContext";
import CanceladoAgenda from "./components/pages/CanceladoAgenda";
import ConfirmacionPago from "./components/pages/ConfirmacionPago";
import TuServicios from "./components/pages/TusServicios";
import NuevoServicio from "./components/pages/NuevoServicio";
import NuevaAgenda from "./components/pages/NuevaAgenda";
import EditarServicio from "./components/pages/EditarServicio";
import MiPerfil from "./components/pages/MiPerfil";
import MiDisponibilidad from "./components/pages/MiDisponibilidad";
import HistorialAccesos from "./components/pages/HistorialAccesos";
import { InformePsicologico } from "./components/pages/InformePsicologico";
import PatientRoute from "./context/PatientRoute";
import PsicologoRoute from "./context/PsicologoRoute";
import PublicRoute
  from "./context/PublicRoute";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Layout><Home /></Layout>} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* agendamiento */}
          <Route path="/tus_citas" element={<Layout><TusCitas /></Layout>} />
          <Route path="/cita/:id" element={<Layout><DetalleCita /></Layout>} />
          <Route path="/agenda" element={<Layout><Agenda /></Layout>} />
          {/* <Route path="/nueva_agenda" element={<Layout><NuevaAgenda /></Layout>} /> */}
          <Route
            path="/nueva_agenda"
            element={
              <PatientRoute>
                <Layout><NuevaAgenda /></Layout>
              </PatientRoute>
            }
          />
          
          <Route path="/agenda/confirmar" element={<Layout><ConfirmarAgenda /></Layout>} />
          <Route path="/agenda/cancelado" element={<Layout><CanceladoAgenda /></Layout>} />
          <Route path="/agenda/confirmado" element={<Layout><ConfirmacionPago /></Layout>} />

          {/* servicios */}
          <Route path="/tus_servicios" element={<Layout><TuServicios /></Layout>} />
          <Route path="/servicios/editar_servicio" element={<Layout><EditarServicio /></Layout>} />
          <Route path="/crear_servicios" element={<Layout><NuevoServicio /></Layout>} />
          <Route path="/verificar_cuenta" element={<Layout><VerificarCuenta /></Layout>} />
          <Route path="/verificar_codigo" element={<Layout><VerificarCodigo /></Layout>} />

          {/* perfil de usuario */}
          <Route path="/mi_perfil" element={<Layout><MiPerfil /></Layout>} />

          {/* mi disponibilidad */}
          {/* <Route path="/mi_disponibilidad" element={<Layout><MiDisponibilidad /></Layout>} /> */}
          <Route
            path="/mi_disponibilidad"
            element={
              <PsicologoRoute>
                <Layout><MiDisponibilidad /></Layout>
              </PsicologoRoute>
            }
          />

          {/* HISTORIAL DE ACCESOS */}\
          <Route path="/historial_accesos" element={<Layout><HistorialAccesos /></Layout>} />

          {/* informe psaicologo */}
          {/* <Route path="/informe_psicologico/:idCita" element={<Layout><InformePsicologico /></Layout>} /> */}
          <Route
            path="/informe_psicologico/:idCita"
            element={
              <PsicologoRoute>
                <Layout><InformePsicologico /></Layout>
              </PsicologoRoute>
            }
          />
          {/* Ruta para cuando no se encuentre la página */}
          <Route path="*" element={<Navigate to="/nueva_agenda" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
