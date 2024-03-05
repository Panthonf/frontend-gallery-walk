import { 
    Text, 
    Center, 
    Container, 
    Button, 
    Affix, 
    Image, 
    Divider 
} from "@mantine/core";

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

            {/* image container */}
            <Affix position={{ top: "150", left: "420" }} style={{ zIndex: "0" }}>
                <Image
                    h={250}
                    opacity="50%"
                    src="/src/images/icon-3.png"
                    style={{ transform: "rotate(180deg)" }}
                    visibleFrom=""
                />
            </Affix>

            {/* login container */}
            <Center
                style={{
                    height: "100vh",
                }}
            >
                <Container size="xs" p="3rem" className={styles.logincontainer} style={{ zIndex: "1" }}>
                    <Text size="topic" c="redcolor.4" fw={500}>
                        Let's get Started!
                    </Text>
                    <Text mt="lg">
                        Welcome back, members! Please log-in to continue in the Event Management system.
                    </Text>

                    <Divider size="xs" my="md" />

                    <Text size="small">
                        Our event management system is designed to help you manage your events efficiently, save time and resources, and track your event performance.
                    </Text>

                    {/* google account container */}
                    <Center>
                        <Button
                            color="redcolor.4"
                            size="md"
                            w="100%"
                            justify="center"
                            variant="outline"
                            mt="lg"
                            leftSection={<IconBrandGoogleFilled size={14} />}
                            onClick={handleGoogleLogin}
                        >
                            <Text c="redcolor.4">Login with Google account</Text>
                        </Button>
                    </Center>
                </Container>
            </Center>

            {/* footer */}
            <Affix className={` ${styles.footer} ${styles.event}`}></Affix>
        </body>
    );
}
