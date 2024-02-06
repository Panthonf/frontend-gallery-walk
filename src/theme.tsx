import { ReactNode } from "react";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  colors: {
    white: ["#FFFDFD", "#FFFDFD", "#FFFDFD", "#FFFDFD", "#FFFDFD", "#FFFDFD", "#FFFDFD", "#FFFDFD", "#FFFDFD", "#FFFDFD"],
    red: ["#EB5353", "#EB5353", "#EB5353", "#EB5353", "#EB5353", "#EB5353", "#EB5353", "#EB5353", "#EB5353", "#EB5353"],
    lightRed: ["#F9D1D1", "#F9D1D1", "#F9D1D1", "#F9D1D1", "#F9D1D1", "#F9D1D1", "#F9D1D1", "#F9D1D1", "#F9D1D1", "#F9D1D1"],
    black: ["#2B0B0B", "#2B0B0B", "#2B0B0B", "#2B0B0B", "#2B0B0B", "#2B0B0B", "#2B0B0B", "#2B0B0B", "#2B0B0B", "#2B0B0B"],
  },
});

interface ThemeProps {
  children: ReactNode;
}

export default function Theme({ children }: ThemeProps) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
