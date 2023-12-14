// import react component
import { Link } from "react-router-dom";

// import mantine component
import {
    Grid,
    Text,
    Container,
    Flex,
    Button,
    Divider,
    Input,
    PasswordInput,
    Group,
    Checkbox,
    Center
} from "@mantine/core";
import { useForm, hasLength } from "@mantine/form";
import "@mantine/core/styles.css";

// import styles css
// import styles from "./styles.module.css";

import {
    IconBrandGoogleFilled,
    // IconBrandFacebookFilled,
    IconLock,
    IconMail,
} from "@tabler/icons-react";

// import components
import Navbar from "./components/homepage_navbar";

export default function Login() {

    // google login
    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_BACKEND_ENDPOINT;
    };

    // mantine form value
    const form = useForm({
        initialValues: {
            email: "",
            termsOfService: false,
            password: "",
        },

        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
            password: hasLength(
                { min: 8, max: 12 },
                "Password must be 8-12 characters long"
            ),
        },
    });
    return (
        <body>
            {/* navbar */}
            <Navbar />

            <Center style={{
                height: "calc(100vh - 15rem)",
            }}>
                {/* login container */}
                <Container size="xl" p="xl">
                    <Grid>
                        <Grid.Col span={6}>
                            <Text size="topic" c="redcolor.4" fw={500}>
                                Login your account
                            </Text>
                            <Text mt="lg">
                                Lorem ipsum dolor sit amet consectetur adipisicing
                                elit. Quasi at amet perspiciatis in, quas nobis, sit
                                id blanditiis recusandae saepe atque laudantium
                                ratione asperiores culpa numquam provident,
                                obcaecati repellat? Autem!
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={6} my="auto" p="xl">
                            <Container my="auto">
                                <Flex justify="center">
                                    <Button
                                        color="deepredcolor.9"
                                        size="md"
                                        w="60%"
                                        justify="center"
                                        variant="outline"
                                        leftSection={
                                            <IconBrandGoogleFilled size={14} />
                                        }
                                        onClick={handleGoogleLogin}>

                                        <Text c="deepredcolor.9">
                                            Login with Google account
                                        </Text>
                                    </Button>
                                    {/* <Button
                                        color="deepredcolor.9"
                                        size="md"
                                        w="60%"
                                        ml="xl"
                                        justify="center"
                                        variant="outline"
                                        leftSection={
                                            <IconBrandFacebookFilled size={14} />
                                        }>
                                        <Text c="deepredcolor.9">
                                            Login with Facebook account
                                        </Text>
                                    </Button> */}
                                </Flex>
                                <Divider
                                    my="xl"
                                    label="or"
                                    c="graycolor.2"
                                    labelPosition="center"
                                />
                                <form
                                    onSubmit={form.onSubmit((values) =>
                                        console.log(values)
                                    )}>
                                    <Input
                                        leftSection={<IconMail size={14} />}
                                        placeholder="Username or Email"
                                        mb="xl"
                                        {...form.getInputProps("email")}
                                    />
                                    <PasswordInput
                                        leftSection={<IconLock size={14} />}
                                        placeholder="Password"
                                        {...form.getInputProps("password")}
                                    />
                                    <Flex align="center" justify="space-between" mt="xl">
                                        <Checkbox
                                            size="xs"
                                            color="redcolor.4"
                                            label="I agree to sell my privacy"
                                            {...form.getInputProps(
                                                "termsOfService",
                                                {
                                                    type: "checkbox",
                                                }
                                            )}
                                        />
                                        <Button variant="transparent" size="md" mr="-lg">
                                            <Text c="graycolor.2" size="xs">Forget password?</Text>
                                        </Button>
                                    </Flex>
                                    <Group justify="flex-end" mt="md">
                                        <Button
                                            w="100%"
                                            size="md"
                                            justify="center"
                                            type="submit">
                                            <Text c="pinkcolor.1">Login!</Text>
                                        </Button>
                                    </Group>
                                </form>
                                <Center mt="lg">
                                    <Text size="xs" c="graycolor.2">Already have an account.
                                        <Link to="/register" style={{ color: "var(--deepredcolor)", margin: "0.5rem" }}>
                                            Sign-up
                                        </Link>
                                    </Text>
                                </Center>
                            </Container>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Center>
        </body>
    );
}
