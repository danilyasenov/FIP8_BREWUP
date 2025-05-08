import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // заменили HashRouter на BrowserRouter
import Header from "./components/Header";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";
import UserOrders from "./pages/UserOrders";
import LoginForm from './pages/LoginForm';
import RegisterForm from "./pages/RegisterForm";
import { Toaster } from "react-hot-toast";
import "./i18n/i18n";
import { useNavigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
