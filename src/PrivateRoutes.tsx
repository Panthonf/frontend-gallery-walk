import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface AuthResponse {
  authenticated: boolean;
  // Add other properties if present in your response
}

const PrivateRoutes = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_CHECK_LOGIN, {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        if (response.ok) {
          const data: AuthResponse = await response.json();
          console.log("Authentication status:", data.authenticated);
          setToken(data.authenticated);
        } else {
          console.error("Failed to fetch authentication status:", response.status);
          setToken(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setToken(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
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
