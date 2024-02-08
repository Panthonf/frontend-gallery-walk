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
      .get<AuthResponse>("https://backend-gallery-walk-production.up.railway.app/isLoggedIn" , {
        withCredentials: true,
      })
      .then((res: AxiosResponse<AuthResponse>) => {
        console.log("ddd", res.data.authenticated);
        setToken(res.data.authenticated);
      })
      .catch((err) => {
        setToken(false);
        console.log("eee", err);
        console.log("eee", err.response.data.authenticated);
      });
  }, []);

  return token === null ? null : token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
