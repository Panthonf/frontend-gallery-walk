import { Outlet, Navigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface AuthResponse {
  authenticated: boolean;
  // Add other properties if present in your response
}

const PrivateRoutes = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<boolean | null>(null);

  useEffect(() => {
    axios
      .get<AuthResponse>(import.meta.env.VITE_CHECK_LOGIN, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<AuthResponse>) => {
        console.log("Authentication status:", res.data.authenticated);
        setToken(res.data.authenticated);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error checking authentication:", err);
        setToken(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator
  }

  if (token === null) {
    return null; // If token is still null, wait for the authentication status
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
