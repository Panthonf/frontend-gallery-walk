import { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import { useLocation } from "react-router-dom";
import { Anchor, Card, Center } from "@mantine/core";

const PDFViewer = () => {
  const viewerDiv = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const docUrl = queryParams.get("pdf");
  document.title = `${docUrl?.split("/").pop() || ""}`;
  const [isDocUrl, setIsDocUrl] = useState(false);

  useEffect(() => {
    if (!docUrl) {
      setIsDocUrl(true);
      return;
    }

    WebViewer(
      {
        path: "lib",
        initialDoc: docUrl,
      },
      viewerDiv.current as HTMLDivElement
    ).then(() => {});
  }, [docUrl, location.search]);

  return isDocUrl ? (
    <div>
      <Center>
        <Card mt="lg" shadow="sm" padding="xl" radius="lg">
          <h1>PDF not found</h1>
          <Anchor
            underline="always"
            c="red"
            onClick={() => window.history.back()}
          >
            Go back
          </Anchor>
        </Card>
      </Center>
    </div>
  ) : (
    <div ref={viewerDiv} style={{ height: "100vh" }}></div>
  );
};

export default PDFViewer;
