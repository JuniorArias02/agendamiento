import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

// Páginas
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Agenda from "./components/pages/Agenda";
import ConfirmarAgenda from "./components/pages/Confirmar";
import CanceladoAgenda from "./components/pages/CanceladoAgenda";
import ConfirmacionPago from "./components/pages/ConfirmacionPago";
import NuevaAgenda from "./components/pages/NuevaAgenda";
import TusCitas from "./components/pages/TusCitas";
import DetalleCita from "./components/pages/DetalleCita";
import TuServicios from "./components/pages/TusServicios";
import EditarServicio from "./components/pages/EditarServicio";
import NuevoServicio from "./components/pages/NuevoServicio";
import MiPerfil from "./components/pages/MiPerfil";
import MiDisponibilidad from "./components/pages/MiDisponibilidad";
import HistorialAccesos from "./components/pages/HistorialAccesos";
import VerificarCuenta from "./components/pages/VerificarCuenta";
import VerificarCodigo from "./components/pages/VerificarCodigo";
import { InformePsicologico } from "./components/pages/InformePsicologico";
import ReagendarCita from "./components/pages/reagendarCita";
// Protecciones
import PatientRoute from "./context/PatientRoute";
import PsicologoRoute from "./context/PsicologoRoute";
import VistaDescuentos from "./components/pages/Descuentos";

import { RUTAS } from "./routers/routers";

function App() {
  return (
    <Routes>
      <Route path={RUTAS.HOME} element={<Home />} />
      <Route path={RUTAS.LOGIN} element={<Login />} />

      {/* Agendamiento */}
      <Route path={RUTAS.AGENDA.ROOT} element={<Layout><Agenda /></Layout>} />
      <Route path={RUTAS.AGENDA.NUEVA} element={
        <PatientRoute>
          <Layout><NuevaAgenda /></Layout>
        </PatientRoute>
      } />

      <Route path={RUTAS.AGENDA.CONFIRMAR} element={<Layout><ConfirmarAgenda /></Layout>} />
      <Route path={RUTAS.AGENDA.CANCELADO} element={<Layout><CanceladoAgenda /></Layout>} />
      <Route path={RUTAS.AGENDA.CONFIRMADO} element={<Layout><ConfirmacionPago /></Layout>} />

      {/* Citas */}
      <Route path={RUTAS.TUS_CITAS.ROOT} element={<Layout><TusCitas /></Layout>} />
      <Route path={RUTAS.TUS_CITAS.DETALLE} element={<Layout><DetalleCita /></Layout>} />

      {/* Servicios */}
      <Route path={RUTAS.SERVICIOS.TUS} element={<Layout><TuServicios /></Layout>} />
      <Route path={RUTAS.SERVICIOS.EDITAR} element={<Layout><EditarServicio /></Layout>} />
      <Route path={RUTAS.SERVICIOS.CREAR} element={<Layout><NuevoServicio /></Layout>} />

      {/* Verificación */}
      <Route path={RUTAS.VERIFICACION.VERIFICAR_CUENTA} element={<Layout><VerificarCuenta /></Layout>} />
      <Route path={RUTAS.VERIFICACION.VERIFICAR_CODIGO} element={<Layout><VerificarCodigo /></Layout>} />

      {/* Perfil y disponibilidad */}
      <Route path={RUTAS.PERFIL} element={<Layout><MiPerfil /></Layout>} />

      <Route path={RUTAS.DISPONIBILIDAD} element={
        <PsicologoRoute>
          <Layout><MiDisponibilidad /></Layout>
        </PsicologoRoute>
      } />

      {/* Otros */}
      <Route path={RUTAS.HISTORIAL_ACCESOS} element={<Layout><HistorialAccesos /></Layout>} />

      <Route path={RUTAS.INFORME.PSICOLOGICO} element={
        <PsicologoRoute>
          <Layout><InformePsicologico /></Layout>
        </PsicologoRoute>
      } />

      <Route path={RUTAS.DESCUENTOS} element={
        <PsicologoRoute>
          <Layout><VistaDescuentos /></Layout>
        </PsicologoRoute>
      } />

      <Route path={RUTAS.TUS_CITAS.REAGENDAR} element={
        <PsicologoRoute>
          <Layout><ReagendarCita /></Layout>
        </PsicologoRoute>
      } />
      {/* Ruta por defecto */}
      <Route path={RUTAS.NOT_FOUND} element={<Navigate to={RUTAS.AGENDA.NUEVA} replace />} />
    </Routes>
  );
}

export default App;
