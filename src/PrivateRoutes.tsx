import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const PrivateRoutes = () => {
  const [token, setToken] = useState<any>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/isLoggedIn", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("ddd", res.data.authenticated);
        setToken(res.data.authenticated);
      })
      .catch((err) => {
        setToken(false);
        console.log("eee", err);
      });
  }, []); // Empty dependency array ensures useEffect runs only once when the component mounts

  return token === null ? null : token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
