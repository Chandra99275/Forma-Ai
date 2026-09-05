import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= PAGES =================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import DynamicForms from "./pages/DynamicForms";
import AIParser from "./pages/AIParser";
import Analytics from "./pages/Analytics";
import Submissions from "./pages/Submissions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// ================= 404 PAGE =================
function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LANDING PAGE ================= */}
        <Route path="/" element={<Home />} />

        {/* ================= AUTHENTICATION ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= USER DASHBOARD ================= */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* ================= DYNAMIC INSURANCE FORMS ================= */}
        <Route
          path="/dynamic-forms"
          element={<DynamicForms />}
        />

        {/* ================= AI PARSER ================= */}
        <Route
          path="/ai-parser"
          element={<AIParser />}
        />

        {/* ================= ANALYTICS ================= */}
        <Route
          path="/analytics"
          element={<Analytics />}
        />

        {/* ================= SUBMISSIONS ================= */}
        <Route
          path="/submissions"
          element={<Submissions />}
        />

        {/* ================= PROFILE ================= */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* ================= SETTINGS ================= */}
        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* ================= 404 PAGE ================= */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;