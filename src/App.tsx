// import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import "@mantine/core/styles.css";

import styles from "./styles.module.css";
import "@mantine/dates/styles.css";

import { MantineProvider, createTheme, Button, Input, Select, Card } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";

import Homepage from "./homepage.tsx";
import Login from "./login.tsx";
import Register from "./register.tsx";
import Dashboard from "./Event Manager and Presenter/dashboard.tsx";
import PrivateRoutes from "./PrivateRoutes.tsx";
import CreateEvent from "./Event Manager and Presenter/createEvent.tsx";
import Event from "./Event Manager and Presenter/event.tsx";

import GuestEventDashboard from "./Guest/guestEventDashboard.tsx";
import GuestLogin from "./Guest/guestLogin.tsx";
import { NotFoundTitle } from "./components/notFoundTitle.tsx";

// import Test from "./test.tsx";
// import { DateTimePicker } from "@mantine/dates";

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
            classNames: {
                label: styles.labelcomponent,
            },
        }),
        Select: Select.extend({
            classNames: {
                input: styles.select,
            },
        }),
    },
});

export default function App() {
    return (
        <Router>
            <MantineProvider theme={theme}>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<PrivateRoutes />}>
                        <Route
                            element={<Dashboard />}
                            path="/dashboard"
                            caseSensitive={true}
                        />
                        <Route path="/create-event" element={<CreateEvent />} />
                        <Route path="/event/:eventId" element={<Event />} />
                    </Route>

                    <Route
                        path="/guest/event/:eventId"
                        element={<GuestEventDashboard />}
                    />

                    <Route path="/guest/event" element={<GuestEventDashboard />} />
                    <Route path="/guest/login" element={<GuestLogin />}></Route>
                    <Route path="*" element={<NotFoundTitle />} />
                    <Route path="/404" element={<NotFoundTitle />} />
                </Routes>
            </MantineProvider>
        </Router>
    );
}
