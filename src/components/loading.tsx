import { LoadingOverlay } from "@mantine/core";
export const LoadingIndicator = () => (
  <LoadingOverlay
    visible={true}
    zIndex={1000}
    overlayProps={{ radius: "sm", blur: 2 }}
    loaderProps={{ color: "", type: "oval" }}
    transitionProps={{ duration: 2000 }}
  />
);
