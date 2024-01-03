import { Button, Center, Text } from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

export default function GuestLogin() {

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_BASE_ENDPOINTMENT + `guests/login/google`;
  };
  return (
    (document.title = `Guest Login`),
    (
      <div>
        <h1>Guest Login</h1>
        <Center>
          <Button
            color="deepredcolor.9"
            size="md"
            w="100%"
            justify="center"
            variant="outline"
            mt="xl"
            leftSection={<IconBrandGoogleFilled size={14} />}
            onClick={handleGoogleLogin}
          >
            <Text c="deepredcolor.9">Login with Google account</Text>
          </Button>
        </Center>
      </div>
    )
  );
}
