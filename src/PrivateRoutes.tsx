import { Outlet, Navigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

interface AuthResponse {
  authenticated: boolean;
  // Add other properties if present in your response
}

const PrivateRoutes = () => {
  const [token, setToken] = useState<boolean | null>(null);

  useEffect(() => {
    axios
      .get<AuthResponse>(import.meta.env.VITE_CHECK_LOGIN, {
        withCredentials: true,
      })
      .then((res: AxiosResponse<AuthResponse>) => {
        console.log("ddd", res.data.authenticated);
        console.log("api", import.meta.env.VITE_CHECK_LOGIN);

        setToken(res.data.authenticated);
      })
      .catch((err) => {
        setToken(false);
        console.log("eee", err);
      });
  }, []);

  return token === null ? null : token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
