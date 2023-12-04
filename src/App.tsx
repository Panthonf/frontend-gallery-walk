// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

import Homepage from "./homepage.tsx";


export default function App() {
    return (
        <MantineProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Homepage />}></Route>

          
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
}
