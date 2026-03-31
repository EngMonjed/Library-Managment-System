import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
function getToken() {
return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getToken());
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    setIsLoggedIn(false);
  };
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }
  return <DashboardLayout onLogout={handleLogout} />;
}
