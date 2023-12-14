import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
    colors: {
        white: "#FFFDFD",
        red: "#EB5353",
        pink: "#F9D1D1",
        deepRed: "#2B0B0B",
    },
});

export default function Theme({ children }) {
    return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
