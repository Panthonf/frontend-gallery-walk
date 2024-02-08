// import mantine component
import {
    Grid,
    Text,
    Container,
    Flex,
    Button,
    Divider,
    Center,
} from "@mantine/core";
// import { useForm, hasLength } from "@mantine/form";
// import { useDisclosure } from '@mantine/hooks';
import "@mantine/core/styles.css";

// import styles css
// import styles from "./styles.module.css";

import {
    IconBrandGoogleFilled,
    // IconBrandFacebookFilled,
    // IconLock,
    // IconMail,
} from "@tabler/icons-react";

// import components
import Navbar from "./components/homepage_navbar";

export default function Register() {

    // google register
    const handleGoogleRegister = () => {
        window.location.href = import.meta.env.VITE_BACKEND_ENDPOINT;
    };


    // mantine form value
    // const form = useForm({
    //     initialValues: {
    //         firstName: "",
    //         lastName: "",
    //         firstNameTH: "",
    //         lastNameTH: "",
    //         affiliation: "",
    //         email: "",
    //         termsOfService: false,
    //         password: "",
    //         confirmPassword: ""
    //     },

    //     validate: {
    //         firstName: (value) =>
    //             value.length < 2 ? 'First name is too short' : null,
    //         lastName: (value) =>
    //             value.length < 2 ? 'Last name is too short' : null,
    //         firstNameTH: (value) =>
    //             value.length < 2 ? 'First name is too short' : null,
    //         lastNameTH: (value) =>
    //             value.length < 2 ? 'Last name is too short' : null,
    //         affiliation: hasLength({ min: 2, max: 10 }, 'affiliation must be 2-10 characters long'),
    //         email: (value) =>
    //             /^\S+@\S+$/.test(value) ? null : "Invalid email",
    //         password: hasLength({ min: 6, max: 12 }, 'password must be 6-12 characters long'),
    //         confirmPassword: (value, values) =>
    //             value !== values.password ? 'Passwords did not match' : null,
    //     },
    //     transformValues: (values) => ({
    //         fullName: `${values.firstName} ${values.lastName}`,
    //         fullNameTH: `${values.firstNameTH} ${values.lastNameTH}`,

    //     }),
    // });

    // const [visible, { toggle }] = useDisclosure(false);

    return (
        <body>
            {/* navbar */}
            <Navbar />

            <Center style={{
                height: "calc(100vh - 15rem)",
            }}>
                {/* register container */}
                <Container size="xl" p="xl">
                    <Grid>
                        <Grid.Col span={6}>
                            <Text size="topic" c="redcolor.4" fw={500}>
                                Create your account
                            </Text>
                            <Text mt="lg">
                                Lorem ipsum dolor sit amet consectetur adipisicing
                                elit. Quasi at amet perspiciatis in, quas nobis, sit
                                id blanditiis recusandae saepe atque laudantium
                                ratione asperiores culpa numquam provident,
                                obcaecati repellat? Autem!
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={6} my="auto">
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
                                        onClick={handleGoogleRegister}
                                    >
                                        <Text c="deepredcolor.9">
                                            Sign-up with Google account
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
                                {/* <form
                                    onSubmit={form.onSubmit((values) =>
                                        console.log(values)
                                    )}>
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <Input
                                                leftSection={<IconMail size={14} />}
                                                placeholder="First Name"

                                                {...form.getInputProps("firstName")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Input
                                                leftSection={<IconMail size={14} />}
                                                placeholder="Last Name"

                                                {...form.getInputProps("lastName")}
                                            />
                                        </Grid.Col>

                                        <Grid.Col span={6}>
                                            <Input
                                                leftSection={<IconMail size={14} />}
                                                placeholder="ชื่อภาษาไทย"

                                                {...form.getInputProps("firstNameTH")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Input
                                                leftSection={<IconMail size={14} />}
                                                placeholder="นามสกุลภาษาไทย"

                                                {...form.getInputProps("lastNameTH")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={12}>
                                            <Input
                                                leftSection={<IconMail size={14} />}
                                                placeholder="Affiliation"

                                                {...form.getInputProps("affiliation")}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Grid mt="xl">
                                        <Grid.Col span={12}>
                                            <Input
                                                leftSection={<IconMail size={14} />}
                                                placeholder="Email"

                                                {...form.getInputProps("email")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <PasswordInput
                                                leftSection={<IconLock size={14} />}
                                                placeholder="Password"
                                                visible={visible}
                                                onVisibilityChange={toggle}
                                                {...form.getInputProps("password")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <PasswordInput
                                                leftSection={<IconLock size={14} />}
                                                placeholder="Confirm Password"
                                                visible={visible}
                                                onVisibilityChange={toggle}
                                                {...form.getInputProps("confirmPassword")}
                                            />
                                        </Grid.Col>
                                    </Grid>
                                    <Group justify="flex-end" mt="xl">
                                        <Button
                                            w="100%"
                                            size="md"
                                            justify="center"
                                            type="submit">
                                            <Text c="pinkcolor.1">Sign-up</Text>
                                        </Button>
                                    </Group>
                                </form> */}
                                {/* <Center mt="lg">
                                    <Text size="xs" c="graycolor.2">Already have an account.
                                        <Link to="/login" style={{ color: "var(--deepredcolor)", margin: "0.5rem" }}>
                                            Login
                                        </Link>
                                    </Text>
                                </Center> */}
                            </Container>
                        </Grid.Col>
                    </Grid>
                </Container>
            </Center>
        </body>
    );
}

