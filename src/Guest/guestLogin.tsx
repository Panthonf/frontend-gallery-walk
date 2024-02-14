import {
    Text,
    Center,
    Container,
    Button,
    // Divider,
    Title,
} from "@mantine/core";

import "@mantine/core/styles.css";

// import styles css
import styles from "../styles.module.css";

import {
    IconBrandGoogleFilled,
    // IconBrandFacebookFilled,
} from "@tabler/icons-react";

export default function Login() {

    // google login
    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_BASE_ENDPOINTMENT + `guests/login/google`;
    };

    return (
        <body>

            <Center style={{
                height: "100vh",
            }}>
                <Container size="xs" p="3rem" className={styles.logincontainer}>
                    <Title order={1} c="redcolor.4" fw={500}>
                        Guest
                    </Title>

                    <Text mt="sm">
                        Let's get started by logging in to your account
                    </Text>
                    <Center>
                        <Button
                            color="deepredcolor.9"
                            size="md"
                            w="100%"
                            justify="center"
                            variant="outline"
                            mt="xl"
                            leftSection={
                                <IconBrandGoogleFilled size={14} />
                            }
                            onClick={handleGoogleLogin}>
                            <Text c="deepredcolor.9">
                                Login with Google account
                            </Text>
                        </Button>
                    </Center>
                    {/* <Divider
                        my="lg"
                        label="or"
                        c="graycolor.2"
                        labelPosition="center"
                    />
                    <Center>
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



