// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import MamaDuduChat from "./pages/MamaDuduChat";
import SisNandiChat from "./pages/SisNandiChat";
import MrRakeshChat from "./pages/MrRakeshChat";
import BraVusiChat from "./pages/BraVusiChat";
import OomPietChat from "./pages/OomPietChat";
import MentorMateHomePage from "./pages/MentorMateHomePage";
import TermsAndConditions from "./components/TermsAndConditions"; 
import GoogleCallback from "./pages/GoogleCallback";
import RedirectHandler from "./components/RedirectHandler";
import { GoogleOAuthProvider } from "@react-oauth/google";

 const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/mentormate-homepage" element={<MentorMateHomePage />} />

          {/* Expert chat routes */}
          <Route path="/chat_mama_dudu" element={<MamaDuduChat />} />
          <Route path="/chat_sis_nandi" element={<SisNandiChat />} />
          <Route path="/chat_mr_rakesh" element={<MrRakeshChat />} />
          <Route path="/chat_bra_vusi" element={<BraVusiChat />} />
          <Route path="/chat_oom_piet" element={<OomPietChat />} />

          {/* Extra routes */}
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/redirect" element={<RedirectHandler />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
