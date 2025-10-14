// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import MamaDuduChat from "./pages/MamaDuduChat";
import SisNandiChat from "./pages/SisNandiChat";
import MrRakeshChat from "./pages/MrRakeshChat";
import BraVusiChat from "./pages/BraVusiChat";
import OomPietChat from "./pages/OomPietChat";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Expert chat routes */}
        <Route path="/chat_mama_dudu" element={<MamaDuduChat />} />
        <Route path="/chat_sis_nandi" element={<SisNandiChat />} />
        <Route path="/chat_mr_rakesh" element={<MrRakeshChat />} />
        <Route path="/chat_oom_piet" element={<OomPietChat />} />
        <Route path="/chat_bra_vusi" element={<BraVusiChat />} />
      </Routes>
  );
}

export default App;

