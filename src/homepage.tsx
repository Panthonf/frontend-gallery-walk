import {
    Box,
    Text,
    Flex,
    Grid,
    UnstyledButton,
    Tabs,
    Divider,
    Container,
    Center,
    Button,
} from "@mantine/core";

import styles from "./styles.module.css";

import { IconArrowRight } from "@tabler/icons-react";

export default function Homepage() {
    return (
        <body>
            {/* navbar */}
            <Box p="xl">
                <Grid align="center">
                    <Grid.Col span="auto">Gallery walk</Grid.Col>
                    <Grid.Col span="auto">
                        <Flex justify="flex-end" align="center" gap="lg">
                            <UnstyledButton
                                variant="transparent"
                                className={styles.btn}
                                size="md">
                                Login
                            </UnstyledButton>
                            <UnstyledButton
                                className={`${styles.btn} ${styles.red}`}
                                size="md">
                                Sign up
                            </UnstyledButton>
                        </Flex>
                    </Grid.Col>
                </Grid>

                <Divider my="sm" />
            </Box>

            {/* content container */}
            <Center
                style={{
                    height: 750,
                }}>
                <Container size="xl">
                    {/* tab container */}
                    <Tabs
                        color="#EB5353"
                        defaultValue="home"
                        orientation="vertical">
                        {/* tab list */}
                        <Tabs.List my="auto">
                            <Tabs.Tab value="home" py="md" my="md">
                                Home
                            </Tabs.Tab>
                            <Tabs.Tab value="service" py="md" my="md">
                                Service
                            </Tabs.Tab>
                            <Tabs.Tab value="about" py="md" my="md">
                                About us
                            </Tabs.Tab>
                            <Tabs.Tab value="contact" py="md" my="md">
                                Contact
                            </Tabs.Tab>
                        </Tabs.List>

                        {/* tab panel home */}
                        <Tabs.Panel value="home">
                            <Box p="xl">
                                <Grid>
                                    <Grid.Col span={9}>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur. Accumsan nulla ac vitae
                                            aliquet proin. Non senectus mi vitae
                                            eu.
                                        </Text>
                                        <Text className={styles.header} mt="xl">
                                            Create your own events and Join the
                                            events that interest you.
                                            <Button
                                                color="red"
                                                radius="xs"
                                                size="xl"
                                                rightSection={
                                                    <IconArrowRight size={14} />
                                                }>
                                                Get Start!
                                            </Button>
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={2}></Grid.Col>
                                </Grid>
                            </Box>
                        </Tabs.Panel>

                        {/* tab panel service */}
                        <Tabs.Panel value="service">
                            <Box p="xl">
                                <Grid>
                                    <Grid.Col span={9}>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur. Accumsan nulla ac vitae
                                            aliquet proin. Non senectus mi vitae
                                            eu.
                                        </Text>
                                        <Text className={styles.header} mt="xl">
                                            Create your own events and Join the
                                            events that interest you.
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={2}></Grid.Col>
                                </Grid>
                            </Box>
                        </Tabs.Panel>

                        {/* tab panel about */}
                        <Tabs.Panel value="about">
                            <Box p="xl">
                                <Grid>
                                    <Grid.Col span={9}>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur. Accumsan nulla ac vitae
                                            aliquet proin. Non senectus mi vitae
                                            eu.
                                        </Text>
                                        <Text className={styles.header} mt="xl">
                                            Create your own events and Join the
                                            events that interest you.
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={2}></Grid.Col>
                                </Grid>
                            </Box>
                        </Tabs.Panel>

                        {/* tab panel contact */}
                        <Tabs.Panel value="contact">
                            <Box p="xl">
                                <Grid>
                                    <Grid.Col span={9}>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur. Accumsan nulla ac vitae
                                            aliquet proin. Non senectus mi vitae
                                            eu.
                                        </Text>
                                        <Text className={styles.header} mt="xl">
                                            Create your own events and Join the
                                            events that interest you.
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={2}></Grid.Col>
                                </Grid>
                            </Box>
                        </Tabs.Panel>
                    </Tabs>
                </Container>
            </Center>
        </body>
    );
}
