// import axios
import axios from "axios";

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
    Image,
    UnstyledButton,
    TextInput,
    Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";

// import styles css
import styles from "./styles.module.css";

// import icon form tabler react
import { IconArrowRight, IconMail, IconMapPin, IconPhone, IconSunHigh } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

// interface
interface FormValues {
    name: string;
    email: string;
    message: string;
}

// sentence for random
const sentences = [
    'Create Your Own Events',
    'Specify event type: Workshop, competition, presentation, etc.',
    'Choose a clear and catchy event name.',
    'Write a comprehensive description of your event.',
    'Specify date, time, and location.',
    'Set a maximum number of participants.',
    'Configure registration options.',
    'Choose a presentation format: Online, on-site, etc.',
    'Set up payment options (if applicable).',
    'Upload images or videos to promote your event.',
    'Share your event on social media.',
    'Join Events That Interest You',
    'Search by type, topic, or keyword.',
    'Browse by date, time, or location.',
    'View details of each event.',
    'Check eligibility and requirements.',
    'Register for the event.',
    'Prepare for the event.',
    'Attend and enjoy!'
];

export default function Homepage() {

    // useForm mantine
    const form = useForm<FormValues>({
        initialValues: { name: "", email: "", message: "" },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            message: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
        },
    });

    // handle form submit
    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        axios
            // endpoint
            .post("https://getform.io/f/Le3kLMe6", {

                email: form.values.email,
                name: form.values.name,
                message: form.values.message,
            })
            .then(response => console.log(response))
            .catch(error => console.log(error));
    };

    // random
    const [currentSentence, setCurrentSentence] = useState<string>(sentences[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * sentences.length);
            setCurrentSentence(sentences[randomIndex]);
        }, 5000); // Change sentence every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    return (
        <body>

            {/* navbar without login/logout state */}
            <div
                style={{
                    padding: "1rem",
                    height: "3.5rem"
                }}
            >
                <Grid justify="flex-start" gutter="2rem">
                    <Grid.Col span="content">

                        {/* gwalk icon */}
                        <Flex align="center" gap="md">
                            <Image
                                w={30}
                                src="/src/images/icon-1.PNG"
                            />

                            <a href="/">
                                <UnstyledButton>
                                    <Text fw={500}>Gallery walk</Text>
                                </UnstyledButton>
                            </a>
                        </Flex>
                    </Grid.Col>

                    {/* manu container */}
                    <Grid.Col span="auto">
                        <a href="/dashboard">
                            <UnstyledButton mr="lg">
                                <Text>Dashboard</Text>
                            </UnstyledButton>
                        </a>
                    </Grid.Col>
                </Grid>
            </div>

            <Divider size="xs" />

            {/* tab container */}
            <Center
                style={{
                    height: "90vh",
                }}>

                {/* tab header container */}
                <Container size="xl" style={{ position: "relative" }}>

                    <div style={{ position: "fixed", top: "8rem" }}>
                        <Title size="5rem" mt="md" my="auto" c="redcolor.4">Gallery Walk</Title>
                    </div>

                    {/* tab header container */}
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

                            <div style={{ position: "absolute", top: "-5rem", right: "20rem" }}>
                                <Image
                                    h={130}
                                    src="/src/images/icon-1.PNG"
                                />
                            </div>

                            {/* header container */}
                            <Grid gutter="xl">
                                <Grid.Col span="auto">
                                    <Text w="55%">
                                        {currentSentence}
                                    </Text>

                                    <Title size="3.5rem" mt="md" my="auto">

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

                                {/* scroll container - 1 */}
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
                                    <Grid.Col span={4} style={{ position: "relative" }}>
                                        <Text size="xsmall" c="graycolor.2">
                                            Role Group
                                        </Text>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Event Manager
                                        </Text>
                                        <Text>
                                            An Event Manager facilitates hybrid project presentations, allowing event presenters to showcase their work online and offline. Guests can engage, provide feedback, and virtual money, fostering collaboration and innovation.
                                        </Text>

                                        <div style={{ position: "absolute", top: "1rem", left: "8rem" }}>
                                            <Image
                                                h={50}
                                                w={50}
                                                src="/src/images/icon-event.png"
                                            />
                                        </div>
                                    </Grid.Col>

                                    {/* event presenter container */}
                                    <Grid.Col span={4} style={{ position: "relative" }}>
                                        <Text size="xsmall" c="graycolor.2">
                                            Role Group
                                        </Text>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Event Presenter
                                        </Text>
                                        <Text>
                                            An Event Presenter is a project owner who shares their project through an event created by an Event Manager. The presenter can upload project information for the presentation and receive virtual money and feedback from guest.
                                        </Text>

                                        <div style={{ position: "absolute", bottom: "-3rem", left: "0" }}>
                                            <Image
                                                h={80}
                                                w={80}
                                                src="/src/images/icon-presenter.png"
                                            />
                                        </div>
                                    </Grid.Col>

                                    {/* guest container */}
                                    <Grid.Col span={4} style={{ position: "relative" }}>
                                        <Text size="xsmall" c="graycolor.2">
                                            Role Group
                                        </Text>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Guest
                                        </Text>
                                        <Text>
                                            A Guest is an event participant who joins an event created by an Event Manager. They can engage with the presented projects by providing virtual money and feedback.
                                        </Text>

                                        <div style={{ position: "absolute", bottom: "1rem", right: "1rem" }}>
                                            <Image
                                                h={60}
                                                w={60}
                                                src="/src/images/icon-guest.png"
                                            />
                                        </div>
                                    </Grid.Col>

                                    {/* service container */}
                                    <Grid.Col span={4}>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Service
                                        </Text>
                                        <Text>
                                            Our website is accessible on all devices and supports Google account login for a convenient and efficient user experience.
                                        </Text>
                                    </Grid.Col>

                                    {/* virtual money conatienr */}
                                    <Grid.Col span={4}>
                                        <Text mb="md" c="redcolor.4" fw={500}>
                                            Virtual Money
                                        </Text>
                                        <Flex align="center" gap="md">
                                            <Text>
                                                Virtual money is a simulated currency within the event platform. Its value and unit are defined by the Event Manager and can be used by Guest to support projects they find interesting and promising.
                                            </Text>
                                            <Image
                                                w={100}
                                                src="/src/images/icon-2.png"
                                            />
                                        </Flex>
                                    </Grid.Col>
                                </Grid>

                                {/* scroll container - 2 */}
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

                        {/* about us container tab */}
                        <Tabs.Panel value="about" px="5rem">

                            <Grid justify="space-between">

                                <Text mb="2rem">
                                    This website was created as a project for course 261492 by a group of fourth-year students from the Department of Computer Engineering, Faculty of Engineering, Chiang Mai University.
                                </Text>

                                {/* panthon kansap container */}
                                <Grid.Col span={3}>
                                    <Image
                                        h={200}
                                        w={200}
                                        src="/src/images/image-1.jpg"
                                    />

                                    <Text c="redcolor.4" fw={500} my="md">Mr. Panthon Kansap</Text>
                                    <Text>Project Manager and Back-end Developer</Text>
                                </Grid.Col>

                                {/* nuttawan reabreang conatiner */}
                                <Grid.Col span={3}>
                                    <Image
                                        h={200}
                                        w={200}
                                        src="/src/images/image-2.jpg"
                                    />

                                    <Text c="redcolor.4" fw={500} my="md">Miss Nuttawan Reabreang</Text>
                                    <Text>UX/UI Design and Front-end Developer</Text>
                                </Grid.Col>

                                {/* yanatib bhoosawang container*/}
                                <Grid.Col span={3}>
                                    <Image
                                        h={200}
                                        w={200}
                                        src="/src/images/image-3.jpg"
                                    />

                                    <Text c="redcolor.4" fw={500} my="md">Mr. Yanatib Bhoonsawang</Text>
                                    <Text>Front-end Developer</Text>
                                </Grid.Col>

                                {/* scroll container - 3 */}
                                <Grid.Col span="content">
                                    <Center my="auto">
                                        <Flex direction="column" align="center">
                                            <Text
                                                c="graycolor.2"
                                                size="small">
                                                01
                                            </Text>
                                            <Box ta="center" my="sm">
                                                <Divider
                                                    orientation="vertical"
                                                    color="graycolor.2"
                                                    h="4rem"
                                                />
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
                                            </Box>
                                            <Text c="graycolor.2" size="small">
                                                04
                                            </Text>
                                        </Flex>
                                    </Center>
                                </Grid.Col>
                            </Grid>
                        </Tabs.Panel>

                        {/* tab contact container */}
                        <Tabs.Panel value="contact" px="5rem">

                            <Grid gutter="3rem">

                                {/* contact infomation container */}
                                <Grid.Col span={5}>
                                    <Text size="topic" fw={500} c="redcolor.4">
                                        Contact information
                                    </Text>
                                    <Grid gutter="md" mt="1rem">

                                        {/* email */}
                                        <Grid.Col>
                                            <Flex gap="md" align="center">
                                                <IconMail size={18} stroke={1} />
                                                <div>
                                                    <Text size="small" c="graycolor.2">G-mail</Text>
                                                    <Text>gallerywalk@gmail.com</Text>
                                                </div>
                                            </Flex>
                                        </Grid.Col>

                                        {/* phone */}
                                        <Grid.Col>
                                            <Flex gap="md" align="center">
                                                <IconPhone size={18} stroke={1} />
                                                <div>
                                                    <Text size="small" c="graycolor.2">Phone</Text>
                                                    <Text>+66 88-5294254</Text>
                                                </div>
                                            </Flex>
                                        </Grid.Col>

                                        {/* address */}
                                        <Grid.Col>
                                            <Flex gap="md" align="center">
                                                <IconMapPin size={18} stroke={1} />
                                                <div>
                                                    <Text size="small" c="graycolor.2">Address</Text>
                                                    <Text>4th floor 30th Year Building, Faculty of Engineering, Chiang Mai University</Text>
                                                </div>
                                            </Flex>
                                        </Grid.Col>

                                        {/* working hours */}
                                        <Grid.Col>
                                            <Flex gap="md" align="center">
                                                <IconSunHigh size={18} stroke={1} />
                                                <div>
                                                    <Text size="small" c="graycolor.2">Working hours</Text>
                                                    <Text>9 a.m. - 11 p.m.</Text>
                                                </div>
                                            </Flex>
                                        </Grid.Col>
                                    </Grid>
                                </Grid.Col>

                                {/* get in touch container */}
                                <Grid.Col span={6}>
                                    <Text size="topic" fw={500} c="redcolor.4">
                                        Get in touch
                                    </Text>

                                    {/* form container */}
                                    <form onSubmit={formSubmit}>
                                        <TextInput my="1rem" label="Email" placeholder="Email"
                                            required
                                            {...form.getInputProps("email")}
                                        />

                                        <TextInput my="1rem" label="Name" placeholder="Name"
                                            required
                                            {...form.getInputProps("name")}
                                        />

                                        <Textarea
                                            my="1rem"
                                            label="Message"
                                            placeholder="Message"
                                            autosize
                                            minRows={2}
                                            maxRows={4}

                                            required
                                            {...form.getInputProps("message")}
                                        />

                                        <Box ta="end">
                                            <Button type="submit">
                                                Submit
                                            </Button>
                                        </Box>
                                    </form>
                                </Grid.Col>

                                {/* scroll container - 4 */}
                                <Grid.Col span="content">
                                    <Center my="auto" h="100%">
                                        <Flex direction="column" align="center">
                                            <Text
                                                c="graycolor.2"
                                                size="small">
                                                01
                                            </Text>
                                            <Box ta="center" my="sm">
                                                <Divider
                                                    orientation="vertical"
                                                    color="graycolor.2"
                                                    h="4rem"
                                                />
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
                                            </Box>
                                            <Text c="deepredcolor.9" size="small">
                                                04
                                            </Text>
                                        </Flex>
                                    </Center>
                                </Grid.Col>
                            </Grid>
                        </Tabs.Panel>
                    </Tabs>
                </Container>
            </Center>

            {/* graphic */}
            <Affix position={{ bottom: 50, right: -30 }}>
                <Image
                    h={250}
                    opacity="20%"
                    src="/src/images/icon-3.png"
                />
            </Affix>

            {/* footer */}
            <Affix className={` ${styles.footer} ${styles.event}`}></Affix>
        </body>
    );
}
