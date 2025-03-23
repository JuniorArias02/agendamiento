import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./components/pages/Home";
import Agenda from "./components/pages/Agenda";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/agenda" element={<Layout><Agenda /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
