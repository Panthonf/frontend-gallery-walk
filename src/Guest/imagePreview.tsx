// import { Image } from "@mantine/core";
import { useLocation } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Anchor, Center } from "@mantine/core";

export default function ImagePreview() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const imageUrl = queryParams.get("image");
  const imageName = imageUrl?.split("/").pop() || "";
  document.title = `${imageName}`;
  return (
    <figure>
      <Center>
        <Zoom>
          <img alt={imageName} src={imageUrl ?? ""} width="500" />
        </Zoom>
      </Center>
      <Center>
        <figcaption>
          <Anchor underline="always" href={imageUrl ?? ""}>
            {imageName}
          </Anchor>
        </figcaption>
      </Center>
    </figure>
  );
}
