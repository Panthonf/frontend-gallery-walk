import {
    useEffect,
    useState,
} from "react";
import axios from "axios";

import {
    Text,
    Divider,
    Grid,
    Card,
    Button,
    Flex,
    TextInput,
    Group,
    Container,
    SimpleGrid,
    Anchor,
    AspectRatio,
    HoverCard,
    Loader,
    Center,
    Affix,
    ActionIcon,
    Box,

} from "@mantine/core";
import { Pagination } from "@mantine/core";
import Navbar from "../components/navbar";
import moment from "moment";

import {
    IconSquarePlus,
    IconSearch,
    IconMapPin,
    IconPresentation,
    IconClockHour3,
} from "@tabler/icons-react";

import styles from "../styles.module.css";
import ProjectsDashboard from "./projectsDashboard";

export default function Dashboard() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8);
    const [totalEvents, setTotalEvents] = useState(0);
    const [events, setEvents] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("Event manager");

    document.title = `Dashboard | Event Manager`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/search`,
                    {
                        withCredentials: true,
                        params: { query, page, pageSize },
                    }
                );
                console.log("event", response.data.data);
                setEvents(response.data.data);
                setTotalEvents(response.data.totalEvents);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [page, pageSize, query]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/search`,
                    {
                        withCredentials: true,
                        params: { query, page, pageSize },
                    }
                );
                console.log("event fff", response.data);
                setEvents(response.data.data);
                setTotalEvents(response.data.totalEvents);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [page, pageSize, query]);

    const [thumbnails, setThumbnails] = useState<{ [key: number]: string }>({});
    const fetchProjectsData = async () => {
        try {
            await axios
                .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}projects/by-user`, {
                    withCredentials: true,
                    // params: { query, page, pageSize },
                })
                .then((response) => {
                    console.log("project data", response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        const fetchThumbnails = async () => {
            try {
                const thumbnailData = await Promise.all(
                    events.map(async (event: EventType) => {
                        try {
                            const thumbnail = await getThumbnail(event.id);
                            return { eventId: event.id, thumbnail };
                        } catch (thumbnailError) {
                            return { eventId: event.id, thumbnail: "" };
                        }
                    })
                );

                const thumbnailMap: { [key: number]: string } = {};
                thumbnailData.forEach((data) => {
                    thumbnailMap[data.eventId] = data.thumbnail;
                });

                // console.log("Thumbnail Map:", thumbnailMap);
                setThumbnails(thumbnailMap);
            } catch (error) {
                console.error("Error fetching thumbnails:", error);
            }
        };

        fetchThumbnails();

        fetchProjectsData();
    }, [events]);

    async function getThumbnail(event_id: number) {
        const thumbnail = await axios.get(
            `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/thumbnail/${event_id}`,
            {
                withCredentials: true,
            }
        );
        return thumbnail.data.data[0].thumbnail_url;
    }

    type EventType = {
        total_projects: number;
        location: string;
        id: number;
        event_name: string;
        start_date: string;
        end_date: string;
        virtual_money: number;
        unit_money: string;
        description: string;
        video_link: string;
    };

    // const handleDeleteEvent = async (eventId: number) => {
    //     Swal.fire({
    //         title: "Are you sure?",
    //         text: "Do you want to delete this event?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Yes",
    //         cancelButtonText: "No",
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             try {
    //                 await axios
    //                     .delete(
    //                         `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
    //                         {
    //                             withCredentials: true,
    //                         }
    //                     )
    //                     .then(() => {
    //                         Swal.fire({
    //                             title: "Success",
    //                             text: "Delete event success",
    //                             icon: "success",
    //                             timer: 2000,
    //                             showConfirmButton: false,
    //                         }).then(() => {
    //                             window.location.href = "/dashboard";
    //                         });
    //                     })
    //                     .catch((err) => {
    //                         console.log(err);
    //                         Swal.fire({
    //                             title: "Error",
    //                             text: "Delete event error",
    //                             icon: "error",
    //                             confirmButtonText: "OK",
    //                         });
    //                     });
    //             } catch (error) {
    //                 console.error("Error fetching events:", error);
    //             }
    //         }
    //     });
    // };

    // thuumbnail container
    const defaultThumbnailUrl = `https://placehold.co/400?text=`;

    const card = events.map((event: EventType) => {
        const thumbnailUrl =
            thumbnails[event.id] ||
            `${defaultThumbnailUrl}${encodeURIComponent(event.event_name)}`;

        return (

            <Anchor href={`/event/${event.id}`} underline="never">

                <Card key={event.id}
                    className={styles.cardContainer}
                    withBorder padding="lg" radius="md" >

                    <Card.Section mb="sm">
                        {thumbnailUrl && (
                            <AspectRatio h={150} p={0}>
                                <img src={thumbnailUrl} style={{ borderRadius: "0.2rem" }} />
                            </AspectRatio>
                        )}
                    </Card.Section>

                    <Card.Section>
                        <Flex justify="space-between">
                            <Box w="75%">
                                <Text size="topic" c="redcolor.4" fw={600} truncate="end">{event.event_name}</Text>
                            </Box>

                            <Flex gap="xs" align="center">
                                <HoverCard width={280} shadow="md">
                                    <HoverCard.Target>
                                        <Anchor href={"https://www.google.com/maps/search/" + encodeURIComponent(event.location)} underline="never">
                                            <ActionIcon variant="transparent" c="redcolor.4">
                                                <IconMapPin size={14} />
                                            </ActionIcon>
                                        </Anchor>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown w="max-content" bg="var(--whitecolor)">
                                        <Text>{event.location || "-"}</Text>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                                <Flex align="center" gap="0.3rem">
                                    <IconPresentation size={14} />
                                    {event.total_projects || 0}
                                </Flex>
                            </Flex>
                        </Flex>

                        <Flex justify="flex-start" gap="2rem">
                            <div>
                                <Text size="xsmall" c="graycolor.4">
                                    Start event
                                </Text>
                                {moment(event.start_date).format("LL")}

                                <Flex align="center" gap="xs">
                                    <IconClockHour3 size={14} />
                                    {moment().format('LT')}
                                </Flex>
                            </div>
                            <div>
                                <Text size="xsmall" c="graycolor.4">
                                    End event
                                </Text>
                                {moment(event.end_date).format("LL")}

                                <Flex align="center" gap="xs">
                                    <IconClockHour3 size={14} />
                                    {moment().format('LT')}
                                </Flex>
                            </div>

                        </Flex>

                        <Divider size="xs" color="graycolor.2" my="xs" />

                        <div>
                            <Text size="xsmall" c="graycolor.4">
                                Description
                            </Text>
                            <Text lineClamp={2}>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: event.description,
                                    }}
                                />
                            </Text>
                        </div>

                    </Card.Section>

                    {/* <ActionIcon
                        variant="subtle"
                        color="redcolor.4"
                        onClick={() => {
                            handleDeleteEvent(event.id)
                        }}
                    >
                        <IconTrash size={14} />
                    </ActionIcon> */}
                </Card >
            </Anchor>
        );
    });

    return (
        <body>
            {/* navbar */}
            <Navbar />

            <Grid w="80%" p="xl" mx="auto">
                <Grid.Col span={12}>
                    <Text
                        c={activeTab === "Event manager" ? "redcolor.4" : "bluecolor.6"}
                        fw={600}
                        size="topic"
                    >
                        Dashboard
                    </Text>

                    <Flex align="center" gap="md" mt="sm">
                        <Button
                            variant="transparent"
                            size="xs"
                            p={0}
                            color={
                                activeTab === "Event manager" ? "redcolor.4" : "graycolor.2"
                            }
                            onClick={() => setActiveTab("Event manager")}
                        >
                            Event manager
                        </Button>
                        {/* <Text>|</Text> */}
                        <Button
                            variant="transparent"
                            size="xs"
                            p={0}
                            color={activeTab === "Presenter" ? "bluecolor.6" : "graycolor.2"}
                            onClick={() => setActiveTab("Presenter")}
                        >
                            Presenter
                        </Button>
                    </Flex>
                </Grid.Col>

                <Grid.Col span={12}>
                    {activeTab === "Event manager" && (
                        <div>
                            <Grid justify="space-between">
                                <Grid.Col span={6}>
                                    <TextInput
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search events"
                                        rightSection={<IconSearch size={14} />}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Flex gap="lg" justify="end">
                                        <a href="/create-event">
                                            <Button
                                                color="redcolor.4"
                                                size="sm"
                                                justify="center"
                                                variant="filled"
                                                rightSection={<IconSquarePlus size={14} />}
                                            >
                                                <Text c="pinkcolor.1">Create Event!</Text>
                                            </Button>
                                        </a>
                                    </Flex>
                                </Grid.Col>

                                <Grid.Col span={12}>
                                    {isLoading && (
                                        <Center>
                                            <Loader mt="lg" size={40} color="redcolor.4" />
                                        </Center>
                                    )}
                                    {!(isLoading || events.length > 0) && ( // Check both loading and events
                                        <Center h="60vh">
                                            <Flex align="center" direction="column">
                                                <Text size="topic" c="redcolor.4">
                                                    No events found
                                                </Text>
                                                <Text mt="5" size="sm" c="graycolor.2">
                                                    Create a new event to get started
                                                </Text>
                                            </Flex>
                                        </Center>
                                    )}

                                    {events.length > 0 && (
                                        <Container fluid p="0">
                                            <Text size="base" fw={500} c="dark.9" mt="1rem" mb="2rem">
                                                Events
                                            </Text>
                                            <Container fluid p="0">
                                                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3, xl: 4 }} m="0" spacing="md">
                                                    {card}
                                                </SimpleGrid>
                                            </Container>

                                            <Pagination.Root
                                                mt="lg"
                                                color="redcolor.4"
                                                size="sm"
                                                total={Math.ceil(totalEvents / pageSize)}
                                                value={page}
                                                onChange={(newPage) => setPage(newPage)}
                                                mb="2rem"
                                            >
                                                <Group gap={5} justify="center">
                                                    <Pagination.First />
                                                    <Pagination.Previous />
                                                    <Pagination.Items />
                                                    <Pagination.Next />
                                                    <Pagination.Last />
                                                </Group>
                                            </Pagination.Root>
                                        </Container>
                                    )}

                                </Grid.Col>
                            </Grid>
                        </div>
                    )}
                    {activeTab === "Presenter" && (
                        <div>
                            <div>
                                <ProjectsDashboard />
                            </div>
                        </div>
                    )}
                </Grid.Col>
            </Grid>

            {/* footer */}
            <Affix className={`${styles.footer} ${activeTab === "Presenter" ? styles.presenter : styles.event}`} style={{ backgroundColor: activeTab === "Presenter" ? "redcolor.4" : "bluecolor.4" }}>
                <Center h="1.5rem">
                    <Text c={activeTab === "Presenter" ? "bluecolor.1" : "redcolor.1"} size="small" ta="center">
                        {activeTab === "Presenter" ? "Presenter" : "Event Manager"}
                    </Text>
                </Center>
            </Affix>
        </body>
    );
}
