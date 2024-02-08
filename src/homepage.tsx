// import mantine component
import {
    Text,
    Title,
    Flex,
    Grid,
    Container,
    Button,
    Box,
    Divider,
    Tabs,
    Center,
    Affix,
} from "@mantine/core";
import "@mantine/core/styles.css";

// import styles css
import styles from "./styles.module.css";

// import icon form tabler react
import { IconArrowRight } from "@tabler/icons-react";

// import components
// import Navbar from "./components/homepage_navbar";

export default function Homepage() {
    return (
        <body>
            {/* navbar */}
            {/* <Navbar /> */}

            {/* tab container */}
            <Center
                style={{
                    height: "100vh",
                }}>
                {/* tab header container */}
                <Container size="xl">
                    <Tabs
                        color="redcolor.4"
                        defaultValue="home"
                        orientation="vertical">
                        <Tabs.List my="auto">
                            <Tabs.Tab value="home" py="md" mb="md">
                                Home
                            </Tabs.Tab>
                            <Tabs.Tab value="service" py="md" my="md">
                                Service
                            </Tabs.Tab>
                            <Tabs.Tab value="about" py="md" my="md">
                                About us
                            </Tabs.Tab>
                            <Tabs.Tab value="contact" py="md" mt="md">
                                Contact
                            </Tabs.Tab>
                        </Tabs.List>

                        {/* home container tab */}
                        <Tabs.Panel value="home" px="5rem">
                            <Grid gutter="xl">
                                <Grid.Col span="auto">
                                    <Text>
                                        Lorem ipsum dolor sit amet consectetur.
                                        Accumsan nulla ac vitae aliquet proin.
                                        Non senectus mi vitae eu.
                                    </Text>
                                    <Title size="4rem" mt="md" my="auto">
                                        <Text span c="redcolor.4" inherit>
                                            Create
                                        </Text>{" "}
                                        your own events and{" "}
                                        <Text span c="redcolor.4" inherit>
                                            Join
                                        </Text>{" "}
                                        the events that interest you.
                                        <a href="/login">
                                            <Button
                                                w="15rem"
                                                ml="xl"
                                                size="lg"
                                                justify="space-between"
                                                rightSection={
                                                    <IconArrowRight
                                                        className={
                                                            styles.iconcomponent
                                                        }
                                                    />
                                                }>
                                                <Text c="pinkcolor.1">
                                                    Get Start!
                                                </Text>
                                            </Button>
                                        </a>

                                    </Title>
                                </Grid.Col>

                                <Grid.Col span={1} my="auto">
                                    <Center my="auto">
                                        <Flex direction="column" align="center">
                                            <Text
                                                c="deepredcolor.4"
                                                size="small">
                                                01
                                            </Text>
                                            <Box ta="center" my="sm">
                                                <Divider
                                                    orientation="vertical"
                                                    color="deepredcolor.9"
                                                    h="2rem"
                                                />
                                                <Divider
                                                    orientation="vertical"
                                                    color="graycolor.2"
                                                    h="2rem"
                                                />
                                                <Divider
                                                    orientation="vertical"
                                                    color="graycolor.2"
                                                    h="4rem"
                                                />
                                            </Box>
                                            <Text c="graycolor.2" size="small">
                                                04
                                            </Text>
                                        </Flex>
                                    </Center>
                                </Grid.Col>
                            </Grid>
                        </Tabs.Panel>

                        {/* service container tab */}
                        <Tabs.Panel value="service">
                            <Flex>
                                <Grid grow px="5rem" my="auto" gutter="3rem">
                                    <Grid.Col span={4}>
                                        <Text size="xsmall" c="graycolor.2">
                                            Role Group
                                        </Text>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Event Manager
                                        </Text>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur adipisicing elit. Unde
                                            distinctio explicabo, quia illum
                                            totam perferendis. Consequatur eaque
                                            aperiam totam reiciendis vero, a
                                            facere tenetur rem libero saepe
                                            natus, nobis dolor?
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Text size="xsmall" c="graycolor.2">
                                            Role Group
                                        </Text>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Event Presenter
                                        </Text>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur adipisicing elit. Unde
                                            distinctio explicabo, quia illum
                                            totam perferendis. Consequatur eaque
                                            aperiam totam reiciendis vero, a
                                            facere tenetur rem libero saepe
                                            natus, nobis dolor?
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Text size="xsmall" c="graycolor.2">
                                            Role Group
                                        </Text>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Guest
                                        </Text>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur adipisicing elit. Unde
                                            distinctio explicabo, quia illum
                                            totam perferendis. Consequatur eaque
                                            aperiam totam reiciendis vero, a
                                            facere tenetur rem libero saepe
                                            natus, nobis dolor?
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Service
                                        </Text>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur adipisicing elit. Unde
                                            distinctio explicabo, quia illum
                                            totam perferendis. Consequatur eaque
                                            aperiam totam reiciendis vero, a
                                            facere tenetur rem libero saepe
                                            natus, nobis dolor?
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Virtual Money
                                        </Text>
                                        <Text>
                                            Lorem ipsum dolor sit amet
                                            consectetur adipisicing elit. Unde
                                            distinctio explicabo, quia illum
                                            totam perferendis. Consequatur eaque
                                            aperiam totam reiciendis vero, a
                                            facere tenetur rem libero saepe
                                            natus, nobis dolor?
                                        </Text>
                                    </Grid.Col>
                                </Grid>

                                <Center my="auto">
                                    <Flex direction="column" align="center">
                                        <Text c="graycolor.2" size="small">
                                            01
                                        </Text>
                                        <Box ta="center" my="sm">
                                            <Divider
                                                orientation="vertical"
                                                color="graycolor.2"
                                                h="2rem"
                                            />
                                            <Divider
                                                orientation="vertical"
                                                color="deepredcolor.9"
                                                h="2rem"
                                            />
                                            <Divider
                                                orientation="vertical"
                                                color="graycolor.2"
                                                h="4rem"
                                            />
                                        </Box>
                                        <Text c="graycolor.2" size="small">
                                            04
                                        </Text>
                                    </Flex>
                                </Center>
                            </Flex>
                        </Tabs.Panel>
                    </Tabs>
                </Container>
            </Center>
            {/* red footer */}
            <Affix className={styles.footer}></Affix>
        </body>
    );
}
