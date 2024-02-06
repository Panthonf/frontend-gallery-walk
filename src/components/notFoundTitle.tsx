import { Title, Text, Button, Container, Group, Center } from "@mantine/core";
import classes from "./notFoundTitle.module.css";
import { useNavigate } from "react-router-dom";

export function NotFoundTitle() {
  const navigate = useNavigate();
  return (
    <Container className={classes.root}>
      <Center>
        <Text
          size="xl"
          variant="gradient"
          fw={700}
          gradient={{ from: "pink", to: "red", deg: 90 }}
        >
          404
        </Text>
      </Center>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group justify="center">
        <Button
          variant="subtle"
          size="md"
          onClick={() => {
            navigate("/");
          }}
        >
          Take me back
        </Button>
      </Group>
    </Container>
  );
}
