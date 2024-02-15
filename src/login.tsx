import { Text, Center, Container, Button } from "@mantine/core";

import "@mantine/core/styles.css";

// import styles css
import styles from "./styles.module.css";

import {
  IconBrandGoogleFilled,
} from "@tabler/icons-react";

export default function Login() {
  // google login
  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_BACKEND_ENDPOINT;
  };

  return (
    <body>
      <Center
        style={{
          height: "100vh",
        }}
      >
        <Container size="xs" p="3rem" className={styles.logincontainer}>
          <Text size="topic" c="redcolor.4" fw={500}>
            Let's get Started!
          </Text>
          <Text mt="lg">
            Welcome back, members! Please log in to continue in Event
            Management.
          </Text>
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
          {/* <Divider
                        my="lg"
                        label="or"
                        c="graycolor.2"
                        labelPosition="center"
                    /> */}
          {/* <Center>
                        <Button
                            color="deepredcolor.9"
                            size="md"
                            w="100%"
                            justify="center"
                            variant="outline"
                            leftSection={
                                <IconBrandFacebookFilled size={14} />
                            }
                            // onClick={handleGoogleLogin}
                            >
                            <Text c="deepredcolor.9">
                                Login with Facebook account
                            </Text>
                        </Button>
                    </Center> */}
        </Container>
      </Center>
    </body>
  );
}
