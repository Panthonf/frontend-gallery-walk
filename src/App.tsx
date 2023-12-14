import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

import "./App.css";

import "@mantine/core/styles.css";

import styles from "./styles.module.css";

import { MantineProvider, createTheme, Button, Input } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";

import Homepage from "./homepage.tsx";
import Login from "./login.tsx";
import Register from "./register.tsx";
import Dashboard from './dashboard.tsx';

// Your PrivateRoute component

// import { Outlet } from 'react-router-dom'





const theme = createTheme({
    fontFamily: "Poppins, sans-serif",
    fontSizes: {
        xsmall: "10px",
        small: "12px",
        base: "14px",
        topic: "16px",
    },
    colors: {
        redcolor: generateColors("#EB5353"),
        pinkcolor: generateColors("#F9D1D1"),
        deepredcolor: generateColors("#210909"),
        graycolor: generateColors("#6A6161"),
        dark: generateColors("#1E1E1E"),
    },

    components: {
        Button: Button.extend({
            defaultProps: {
                color: "redcolor.4",
                variant: "filled",
                radius: "xs",
                size: "lg",
            },
        }),
        Text: {
            defaultProps: {
                color: "dark.9",
                size: "base",
            },
        },
        Input: Input.extend({
            defaultProps: {
                size: "md",
            },
            classNames: {
                input: styles.inputcomponent,
            },
        }),
        InputWrapper: Input.Wrapper.extend({
            classNames: {},
        }),
    },
});

interface PrivateRoutesProps {
    isAuthenticated: boolean;
    children: React.ReactNode; // Add this line to fix the error
}

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ isAuthenticated, children }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};


export default function App() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await axios.get("http://localhost:8080/isLoggedIn", {
                    withCredentials: true
                });
                console.log("Authenticated:", response.data.authenticated);

                if (response.data.authenticated) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setAuthenticated(false);
            }
        };
        checkAuthentication();
    }, []);

    return (
        <Router>
            <MantineProvider theme={theme}>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        element={
                            <PrivateRoutes isAuthenticated={authenticated}>
                                <Route element={<Dashboard />} path="/dashboard" />
                            </PrivateRoutes>
                        }
                    />
                </Routes>
            </MantineProvider>
        </Router>
    );
}
