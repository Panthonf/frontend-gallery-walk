import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Text, Card, Flex, Anchor, Grid, Box, Image, ActionIcon, Menu, Group, Switch, Paper, SimpleGrid, Collapse, UnstyledButton } from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";

import moment from "moment";

import styles from "../styles.module.css";
import QRCode from "qrcode";
import { IconChevronDown, IconCoins, IconCopy, IconCopyCheck, IconDotsVertical, IconEdit, IconLayoutGridAdd, IconQrcode, IconTrash, IconUserQuestion } from "@tabler/icons-react";

interface EventType {
    event_name: string;
    start_date: string;
    description: string;
    published: boolean;
    end_date: string;
    video_link: string;
    number_of_member: number;
    virtual_money: number;
    unit_money: string;
}

export default function Event() {
    const { eventId } = useParams();
    const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");
    const clipboard = useClipboard({ timeout: 500 });

    const [event, setEvent] = useState<EventType | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios
                    .get(`http://localhost:8080/events/${eventId}`, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        console.log(res.data.data);
                        setEvent(res.data.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchData();

        const generateQRCode = async () => {
            try {
                const dataUrl = await QRCode.toDataURL("ddd");
                setQRCodeDataUrl(dataUrl);
            } catch (error) {
                console.error("Error generating QR code:", error);
            }
        };

        if (eventId) {
            generateQRCode();
        }

        document.title = `${event?.event_name} | Virtual Event Manager`;
    }, [eventId, event?.event_name]);

    const [isPublished, setIsPublished] = useState(event?.published || false);

    const handlePublishToggle = async () => {
        await axios
            .put(`http://localhost:8080/events/${eventId}/publish`, {
                withCredentials: true,
            })
            .then((res) => {
                console.log("dd", res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        setIsPublished((prev) => !prev);
    };

    // stat container
    const icons = {
        projects: IconLayoutGridAdd,
        guests: IconUserQuestion,
        money: IconCoins,
    };

    const data = [
        { title: 'Projects', icon: "projects", value: '12', label: "Project from event presenter" },
        { title: 'Guests', icon: "guests", value: '1234', label: "Number of guests" },
        { title: 'All virtual money', icon: "money", value: '745', label: "Number of virtual money all of event" },
    ];

    const stats = data.map((stat) => {
        const Icon = icons[stat.icon];

        return (
            <Paper withBorder p="md" radius="md" key={stat.title} bg="none">
                <Group justify="space-between">
                    <Text size="xs" c="dimmed">
                        {stat.title}
                    </Text>
                    <Icon size={16} />
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text size="base" fw={500}>{stat.value}</Text>
                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    {stat.label}
                </Text>
            </Paper>
            // <Paper withBorder p="md" radius="md" key={stat.title} bg="none" w="100%">
            //     <Group justify="apart">
            //         <div>
            //             <Text c="graycolor.3" tt="uppercase" fw={500} fz="xsmall">
            //                 {stat.title}
            //             </Text>
            //             <Text fw={500} fz="topic">
            //                 {stat.value}
            //             </Text>
            //         </div>

            //     </Group>
            //     <Text c="dimmed" fz="sm" mt="md">
            //         Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            //     </Text>
            // </Paper>
        );
    });

    const [opened, { toggle }] = useDisclosure(false);

    return (
        <body
            style={{
                display: "flex",
            }}
        >
            {/* navbar */}
            {/* <Navbar activeIndex={activeNavbarIndex} /> */}

            <Grid w="100%" p="xl">
                <Grid.Col span={12}>
                    <Anchor href="/dashboard">Back</Anchor>

                    <Card className={styles.cardContainer} p="1rem" radius="md">

                        <Grid>
                            <Grid.Col span={9}>
                                <Text c="redcolor.4" fw={500} size="topic" mb="xs">
                                    {event?.event_name}
                                </Text>
                                <Flex>
                                    <Box>
                                        <Flex mb="md" gap="2rem">
                                            <div>
                                                <Text mb="xs" c="graycolor.3">Start event</Text>
                                                <Text>{moment(event?.start_date).format("MMMM Do YYYY, HH:mm A")}</Text>
                                            </div>
                                            <div>
                                                <Text mb="xs" c="graycolor.3">End event</Text>
                                                <Text>{moment(event?.end_date).format("MMMM Do YYYY, HH:mm A")}</Text>
                                            </div>
                                        </Flex>
                                        <Box mb="md">
                                            <Text w={500} c="graycolor.3" mb="xs">Virtual Money</Text>
                                            <Text>{event?.virtual_money} {event?.unit_money}</Text>
                                        </Box>
                                    </Box>

                                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
                                </Flex>
                                {/* <Box mb="md">
                                    <Text w={500} c="graycolor.3" mb="xs">Description</Text>
                                    <Text>{event?.description}</Text>
                                </Box> */}
                            </Grid.Col>

                            <Grid.Col span="content" m="auto">
                                <Image src={qrCodeDataUrl} alt="QR Code" w="250" />
                            </Grid.Col>

                            <Grid.Col span="content">
                                <Group>
                                    <ActionIcon.Group>
                                        <ActionIcon variant="default" size="lg" aria-label="Gallery">
                                            <IconQrcode size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="default"
                                            size="lg"
                                            aria-label="Settings"
                                            onClick={() => clipboard.copy(event.id.toString())}
                                        >
                                            {clipboard.copied ? (
                                                <IconCopyCheck size={16} />
                                            ) : (
                                                <IconCopy size={16} />
                                            )}
                                        </ActionIcon>
                                        <Menu position="bottom-end" shadow="sm">
                                            <Menu.Target>
                                                <ActionIcon variant="default" size="lg">
                                                    <IconDotsVertical size={16} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item leftSection={<IconEdit size={14} />}>
                                                    Edit event
                                                </Menu.Item>
                                                <Menu.Item
                                                    leftSection={<IconTrash size={14} />}
                                                    color="red"
                                                >
                                                    Delete event
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </ActionIcon.Group>
                                </Group>
                                <Flex align="center" mt="md">
                                    <Switch
                                        checked={isPublished}
                                        onChange={handlePublishToggle}
                                        onLabel="On"
                                        offLabel="Off"
                                        id="publish-toggle"
                                        size="md"
                                    />
                                    <Text ml="md">Publish</Text>
                                </Flex>
                            </Grid.Col>
                        </Grid>
                    </Card>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Group justify="flex-start" mb={5}>
                        <UnstyledButton onClick={toggle}>
                            <Group align="center">
                                <Text mr="md">Description</Text>
                                <IconChevronDown size={14} />
                            </Group>
                        </UnstyledButton>
                    </Group>

                    <Collapse in={opened} mt="md">
                        <Text>{event?.description}</Text>
                    </Collapse>
                </Grid.Col>
            </Grid>

            {/* <Card
                shadow="md"
                padding="lg"
                radius="lg"
                style={{ maxWidth: 400, margin: "50px auto" }}
            >
                <Title order={1} orderMobile={2} align="center">
                    <Text size="lg" style={{ marginTop: 5 }}>
                        {event?.event_name}
                    </Text>
                </Title>
                <div style={{ marginTop: 20 }}>
                    <Flex justify={"space-between"}>
                        <Text size="md" style={{ marginTop: 10 }} color="gray">
                            Start Date:
                        </Text>
                        <Text size="lg" style={{ marginTop: 5 }}>
                            {moment(event?.start_date).format("DD/MM/YYYY")}
                        </Text>

                        <Text size="md" weight={500} color="gray" style={{ marginTop: 10 }}>
                            End Date:
                        </Text>
                        <Text size="lg" style={{ marginTop: 5 }}>
                            {moment(event?.end_date).format("DD/MM/YYYY")}
                        </Text>
                    </Flex>

                    <Text size="md" weight={500} color="gray" style={{ marginTop: 10 }}>
                        Description:
                    </Text>
                    <Text size="lg" style={{ marginTop: 5 }}>
                        {event?.description}
                    </Text>

                    <Text size="md" weight={500} color="gray" style={{ marginTop: 10 }}>
                        Video Link
                    </Text>
                    <a href={event?.video_link} target="_blank">
                        {event?.video_link}
                    </a>
                    <Text size="md" weight={500} color="gray" style={{ marginTop: 10 }}>
                        Member
                    </Text>
                    <Text size="lg" style={{ marginTop: 5 }}>
                        {event?.number_of_member}
                    </Text>

                    <Text size="md" weight={500} color="gray" style={{ marginTop: 10 }}>
                        Virtual Money
                    </Text>
                    <Text size="lg" style={{ marginTop: 5 }}>
                        {event?.virtual_money} {event?.unit_money}
                    </Text>

                    <Text>
                        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                            <Switch
                                checked={isPublished}
                                onChange={handlePublishToggle}
                                onLabel="Published"
                                offLabel="Unpublished"
                                id="publish-toggle"
                                size="lg"
                            />
                        </div>
                    </Text>

                    <Anchor href="/dashboard">Back</Anchor>
                </div>
            </Card> */}
        </body>
    );
}
