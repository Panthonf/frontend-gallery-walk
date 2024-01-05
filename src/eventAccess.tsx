import { Card, Button, Text, Divider, Title } from "@mantine/core";
import { IconPresentation, IconUser } from "@tabler/icons-react";
import "@mantine/core/styles.css";

export function EventAccess() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Card shadow="sm" w="500" p="xl" maw={500} h="auto">
        <Title order={1} fw={700} ta="center">
          Welcome to the event
        </Title>

        <Text size="xs" fw={700} ta="center">
          Please choose your role to access the event
        </Text>

        <Button
          color="deepredcolor.9"
          size="md"
          w="100%"
          justify="center"
          variant="gradient"
          gradient={{ from: "orange", to: "red", deg: 90 }}
          mt="xl"
          leftSection={<IconUser size={14} />}
        >
          <Text c="white">Guest Login</Text>
        </Button>

        <Divider my="lg" label="or" c="graycolor.2" labelPosition="center" />
        <Button
          color="deepredcolor.9"
          size="md"
          justify="center"
          variant="gradient"
          gradient={{ from: "blue", to: "cyan", deg: 90 }}
          leftSection={<IconPresentation size={14} />}
        >
          <Text c="white" w="auto">
            Presenter Login
          </Text>
        </Button>
      </Card>
    </div>
  );
}
