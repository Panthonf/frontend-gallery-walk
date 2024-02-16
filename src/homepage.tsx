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
    Image
} from "@mantine/core";

// import styles css
import styles from "./styles.module.css";

// import icon form tabler react
import { IconArrowRight } from "@tabler/icons-react";
import Navbar from "./components/navbar";

export default function Homepage() {
    return (
        <body>

            <Navbar />

            {/* tab container */}
            <Center
                style={{
                    height: "100vh",
                }}>

                {/* tab header container */}
                <Container size="xl" style={{ position: "relative" }}>

                    <div style={{ position: "fixed", top: "10rem" }}>
                        <Title size="5rem" mt="md" my="auto" c="redcolor.4">Gallery Walk</Title>
                    </div>

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
                        <Tabs.Panel value="home" px="5rem" style={{ position: "relative" }}>

                            <div style={{ position: "absolute", top: "-3rem", right: "24.75rem" }}>
                                <Image
                                    h={130}
                                    src="/src/images/icon-1.PNG"
                                />
                            </div>

                            <Grid gutter="xl">
                                <Grid.Col span="auto">
                                    <Text w="55%">
                                        Lorem ipsum dolor sit amet
                                        consectetur adipisicing elit. Unde
                                        distinctio explicabo, quia illum
                                        totam perferendis.
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

                                    {/* event manager container */}
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

                                    {/* event presenter container */}
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

                                    {/* guest container */}
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

                                    {/* service container */}
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

                                    {/* virtual money conatienr */}
                                    <Grid.Col span={4}>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Virtual Money
                                        </Text>
                                        <Flex align="center" gap="md">
                                            <Text>
                                                Lorem ipsum dolor sit amet
                                                consectetur adipisicing elit. Unde
                                                distinctio explicabo, quia illum
                                                totam perferendis. Consequatur eaque
                                                aperiam totam reiciendis vero, a
                                                facere tenetur rem libero saepe
                                                natus, nobis dolor?
                                            </Text>
                                            <Image
                                                w={100}
                                                src="/src/images/icon-2.png"
                                            />
                                        </Flex>
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

            <Affix position={{ bottom: 0, right: 0 }}>
                <Image
                    h={300}
                    opacity="30%"
                    src="/src/images/icon-3.png"
                />
            </Affix>

            {/* red footer */}
            <Affix className={` ${styles.footer} ${styles.event}`}></Affix>
        </body>
    );
}
