import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors mt-8"
      id="logout"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
