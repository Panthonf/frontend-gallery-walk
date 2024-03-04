import {
    Card,
    Divider,
    TextInput,
    Text,
    Button,
    Grid,
    Container,
    SimpleGrid,
    Flex,
    Modal,
    Box,
    Anchor,
    Loader,
    Center,
    Group,
    HoverCard,
    Pagination,
    ActionIcon,
    AspectRatio,
    Badge,
} from "@mantine/core";
import {
    IconArrowUpRight,
    IconArrowsJoin,
    IconMapPin,
    IconSearch,
} from "@tabler/icons-react";
import axios from "axios";
import { ReactNode, SetStateAction, useEffect, useState } from "react";
import parse from "html-react-parser";

import styles from "../styles.module.css";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";

type ProjectType = {
    event_data: object;
    virtual_money: ReactNode;
    event_id: ReactNode;
    event_name: string;
    length: number;
    map(
        arg0: (project: ProjectType) => import("react/jsx-runtime").JSX.Element
    ): ReactNode;
    id: number;
    title: string;
    created_at: string;
    description: string;
    submit_start: string;
    submit_end: string;
    project_image: {
        project_image_url: string;
    }[];
};


export default function ProjectsDashboard() {
    const [total, setTotal] = useState(0);
    const [projects, setProjects] = useState<ProjectType | null>();
    const [query, setQuery] = useState("");
    const [page,
        setPage
    ] = useState(1);
    const [pageSize] = useState(5);
    const [opened, { open, close }] = useDisclosure(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            await axios
                .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}projects/by-user`, {
                    withCredentials: true,
                    params: { query, page, pageSize },
                })
                .then((res) => {

                    console.log("projects", res.data);
                    setProjects(res.data.data);
                    setTotal(res.data.totalProjects);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fetchProjects();
    }
        , [query, page, pageSize]);

    const [eventLink, setEventLink] = useState("");

    const handleJoinEvent = () => {
        if (eventLink) {
            window.location.href = eventLink;
        }
    };

    const handleInputChange = (e: {
        target: { value: SetStateAction<string> };
    }) => {
        setEventLink(e.target.value);
    };

    // thuumbnail container
    const defaultThumbnailUrl = `https://placehold.co/400?text=`;

    const card = projects && projects.length > 0 && projects.map((projects: ProjectType) => {

        const thumbnailUrl = projects.project_image[0]?.project_image_url ||
            `${defaultThumbnailUrl}${encodeURIComponent(projects.title)}`;

        return (

            <Anchor onClick={() => {
                window.location.href = `/project/${projects.id}`;
            }}
                underline="never"
            >
                <Card
                    key={projects.id}
                    className={styles.cardContainer}
                    withBorder padding="lg" radius="md" >

                    <Card.Section mb="sm">
                        {thumbnailUrl && (
                            <AspectRatio h={150} p={0}>
                                <img src={thumbnailUrl} style={{ borderRadius: "0.2rem" }} />
                            </AspectRatio>
                        )}
                    </Card.Section>

                    <Flex style={{ position: "absolute", top: "1.5rem", right: "1.5rem" }} gap="xs">
                        <Badge color="bluecolor.4" size="xs">
                            {moment().isBetween(
                                (
                                    projects.event_data as {
                                        start_date: string;
                                        end_date: string;
                                    }
                                )?.start_date,
                                (
                                    projects.event_data as {
                                        start_date: string;
                                        end_date: string;
                                    }
                                )?.end_date
                            )
                                ? "Event ongoing"
                                : "Event ended"}
                        </Badge>

                    </Flex>

                    <Card.Section>
                        <Flex justify="space-between">
                            <Box w="75%">
                                <Text size="topic" c="bluecolor.4" fw={600} truncate="end">{projects.title}</Text>
                            </Box>

                            <Flex gap="xs" align="center">
                                <HoverCard width={280} shadow="md">
                                    <HoverCard.Target>
                                        <Anchor href={"https://www.google.com/maps/search/" + encodeURIComponent((projects.event_data as { location: string })?.location)} underline="never">
                                            <ActionIcon variant="transparent" c="redcolor.4">
                                                <IconMapPin size={14} />
                                            </ActionIcon>
                                        </Anchor>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown w="max-content" bg="var(--whitecolor)">
                                        {(projects.event_data as { location: string })
                                            ?.location
                                            ? (
                                                projects.event_data as {
                                                    location: string;
                                                }
                                            )?.location
                                            : "-"}
                                    </HoverCard.Dropdown>
                                </HoverCard>

                                <HoverCard width={280} shadow="md">
                                    <HoverCard.Target>
                                        <Anchor href={`/event/${projects.event_id}`} style={{ zIndex: "2" }}>
                                            <Badge color="redcolor.4" rightSection={<IconArrowUpRight size={14} />} size="xs">
                                                Event
                                            </Badge>
                                        </Anchor>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown w="max-content" bg="var(--whitecolor)">
                                        {(
                                            projects.event_data as {
                                                event_name: string;
                                            }
                                        )?.event_name ? (
                                            <Text>
                                                {(
                                                    projects.event_data as {
                                                        event_name: string;
                                                    }
                                                )?.event_name}
                                            </Text>
                                        ) : (
                                            "Event was deleted"
                                        )}
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            </Flex>
                        </Flex>

                        <Flex justify="flex-start" gap="2rem">
                            <div>
                                <Text size="xsmall" c="graycolor.4">
                                    Virtual money
                                </Text>
                                <Text truncate="end" maw="max-content" c="bluecolor.4">
                                    {moment().isBetween(
                                        (
                                            projects.event_data as {
                                                start_date: string;
                                                end_date: string;
                                            }
                                        )?.start_date,
                                        (
                                            projects.event_data as {
                                                start_date: string;
                                                end_date: string;
                                            }
                                        )?.end_date
                                    ) ? (
                                        <Text c="redcolor.4" size="xsmall">
                                            Will be available
                                        </Text>
                                    ) : (
                                        projects.virtual_money
                                    )}
                                </Text>
                            </div>

                            <div>
                                <Text size="xsmall" c="graycolor.4">
                                    Created at:
                                </Text>
                                <Text size="small" c="graycolor.2">
                                    {moment(projects.created_at).format(
                                        "LL [at] HH:mm"
                                    )}
                                </Text>
                            </div>
                        </Flex>

                        <Divider size="xs" color="graycolor.2" my="xs" />

                        <div>
                            <Text size="xsmall" c="graycolor.4">
                                Description
                            </Text>
                            <Text lineClamp={2}>
                                {projects.description
                                    ? parse(projects.description)
                                    : "No description"}
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
            </Anchor >
        );
    });

    return (
        <div>
            <Grid>
                <Grid.Col span={6}>
                    <TextInput
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search project"
                        rightSection={<IconSearch size={14} />}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Flex gap="lg" justify="end">
                        <Button
                            color="bluecolor.4"
                            justify="center"
                            variant="filled"
                            rightSection={<IconArrowsJoin size={14} />}
                            onClick={open}
                        >
                            Join event
                        </Button>

                        <Modal
                            opened={opened}
                            onClose={close}
                            title="Join event"
                            centered
                        >
                            <Box ta="end">
                                <TextInput
                                    placeholder="Event link"
                                    mb="md"
                                    value={eventLink}
                                    onChange={handleInputChange}
                                />
                                <Button
                                    color="bluecolor.4"
                                    size="sm"
                                    justify="end"
                                    variant="filled"
                                    type="button"
                                    onClick={handleJoinEvent}
                                >
                                    Join event
                                </Button>
                            </Box>
                        </Modal>
                    </Flex>
                </Grid.Col>

                <Grid.Col span={12}>
                    {isLoading && (
                        <Center>
                            <Loader mt="lg" size={40} color="bluecolor.4" />
                        </Center>
                    )}
                    {!(isLoading || projects && projects.length > 0) && ( // Check both loading and events
                        <Center h="60vh">
                            <Flex align="center" direction="column">
                                <Text size="topic" fw={500} c="bluecolor.4">
                                    No projects found
                                </Text>
                                <Text mt="5" size="sm" c="graycolor.2">
                                    Create a new project to event
                                </Text>
                            </Flex>
                        </Center>
                    )}

                    {projects && projects.length > 0 && (
                        <Container fluid p="0">
                            <Text size="base" fw={500} c="dark.9" mt="1rem" mb="2rem">
                                Projects {total > 0 && `(${total})`}
                            </Text>

                            <Container fluid p="0">
                                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3, xl: 4 }} m="0" spacing="md">
                                    {card}
                                </SimpleGrid>
                            </Container>

                            <Pagination.Root
                                mt="lg"
                                color="bluecolor.4"
                                size="sm"
                                total={Math.ceil(total / pageSize)}
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
            </Grid >
        </div >
    );

}

