import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import AgentDashboard from "./AgentDashboard";
import BookingHistory from "./BookingHistory";
import PaymentPage from "./PaymentPage";
import Invoice from "./Invoice";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;