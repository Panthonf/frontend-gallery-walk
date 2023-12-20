// import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import "@mantine/core/styles.css";

import styles from "./styles.module.css";
import "@mantine/dates/styles.css";

import { MantineProvider, createTheme, Button, Input } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";

import Homepage from "./homepage.tsx";
import Login from "./login.tsx";
import Register from "./register.tsx";
import Dashboard from "./Event Manager and Presenter/dashboard.tsx";
import PrivateRoutes from "./PrivateRoutes.tsx";
import CreateEvent from "./Event Manager and Presenter/createEvent.tsx";
// import Test from "./test.tsx";
import { DateTimePicker } from "@mantine/dates";

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
          </Route>

          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </MantineProvider>
    </Router>
  );
}
