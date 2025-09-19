import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../authContext";

export const useAuthAction = (url, credentials, isLogin = true) => {
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const performAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(url, credentials);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(`${isLogin ? "Login" : "Signup"} Failed!`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, performAction };
};
