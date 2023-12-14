import React, { ReactNode } from "react";
import { MantineProvider, createTheme } from "@mantine/core";

const theme: readonly string[] = createTheme({
  colors: {
    white: "#FFFDFD",
    red: "#EB5353",
    pink: "#F9D1D1",
    deepRed: "#2B0B0B",
  },
});

interface ThemeProps {
  children: ReactNode;
}

export default function Theme({ children }: ThemeProps) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
