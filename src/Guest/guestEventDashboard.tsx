import { useEffect, useState } from "react";

import axios from "axios";
import {
    Flex,
    Text,
    Grid,
    ActionIcon,
    Box,
    Modal,
    Badge,
    AspectRatio,
    Image,
    Group,
    Paper,

} from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles.module.css";
import ProjectsDashboard from "./projectsDashboard";
import moment from "moment";
import { useDisclosure } from "@mantine/hooks";
import { LoadingIndicator } from "../components/loading";
import {
    IconArrowsDiagonal,
    IconCoins,
} from "@tabler/icons-react";

type EventType = {
    id: number;
    start_date: string;
    end_date: string;
    event_name: string;
    virtual_money: number;
    unit_money: string;
    description: string;
    video_link: string;
};

type GuestType = {
    id: number;
    first_name_en: string;
    last_name_en: string;
    email: string;
    virtual_money: number;
};
export default function GuestEventDashboard() {
    const { eventId } = useParams();
    console.log("event id", eventId);
    const guestId = useLocation().search.split("=")[1];
    const navigate = useNavigate();
    const [eventData, setEventData] = useState<EventType | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(
        `https://placehold.co/400?text${eventId}`
    );
    // const [opened, { toggle }] = useDisclosure(false);
    const [isLoading, setIsLoading] = useState(true);
    const [guestData, setGuestData] = useState<GuestType | null>(null);
    // const [opened, { open, close }] = useDisclosure(false);
    // const [isOpened, { toggle }] = useDisclosure(false);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                await axios
                    .get(
                        `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/events/${eventId}`,
                        {
                            withCredentials: true,
                        }
                    )
                    .then((res) => {
                        console.log("event data", res.data.data);
                        document.title = `${res.data.data.event_name}`;
                        setEventData(res.data.data);
                        setIsLoading(false);
                    })
                    .catch((err) => {
                        console.log("err", err.response.data.success);
                        navigate("/404");
                    });
            } catch (error) {
                console.log("err", error);
                navigate("/404");
            }
        };
        const fetchThumbnail = async () => {
            try {
                await axios
                    .get(
                        `${import.meta.env.VITE_BASE_ENDPOINTMENT
                        }events/thumbnail/${eventId}`,
                        {
                            withCredentials: true,
                        }
                    )
                    .then((res) => {
                        console.log("fetch thumbnail", res.data.data[0].thumbnail_url);
                        setThumbnailUrl(res.data.data[0].thumbnail_url);
                    })
                    .catch(() => {
                        // console.log("err", err);
                    });
            } catch (err) {
                // console.log("err", err);
            }
        };

        const checkGuestSession = async () => {
            try {
                await axios
                    .get(
                        `${import.meta.env.VITE_BASE_ENDPOINTMENT
                        }guests/check-guest-session?eventId=${eventId}&guestId=${guestId}`,
                        {
                            withCredentials: true,
                        }
                    )
                    .then((res) => {
                        if (res.data.success === false) {
                            navigate("/guest/login");
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                        navigate("/guest/login");
                    });
            } catch (err) {
                navigate("/guest/login");
            }
        };

        const fetchGuestData = async () => {
            try {
                await axios
                    .get(
                        `${import.meta.env.VITE_BASE_ENDPOINTMENT
                        }guests/get-guest-data?eventId=${eventId}`,
                        {
                            withCredentials: true,
                        }
                    )
                    .then((res) => {
                        console.log("guest data", res.data.data);
                        if (res.data.data) {
                            setGuestData(res.data.data);
                        } else {
                            navigate("/guest/login");
                        }
                    })
                    .catch((err) => {
                        console.log("err", err);
                        navigate("/guest/login");
                    });
            } catch (err) {
                console.log("err", err);
                navigate("/guest/login");
            }
        };

        if (!guestId) navigate("/guest/login");
        if (guestId)
            if (eventId) {
                checkGuestSession();
                fetchEventData();
                fetchThumbnail();
                fetchGuestData();
            } else {
                navigate("/guest/login");
            }
    }, [eventId, guestId, navigate]);

    if (!eventId || isLoading) {
        return <LoadingIndicator />;
    }

    const ModalDescription = () => {
        const [opened, { open, close }] = useDisclosure(false);

        return (
            <>
                <Text c="graycolor.2" mb="xs">
                    Description
                </Text>

                <Flex align="flex-end">
                    <Text lineClamp={5}>
                        <div
                            dangerouslySetInnerHTML={{ __html: eventData?.description.toString() || "" }}
                        />
                    </Text>
                    <ActionIcon variant="subtle" onClick={open} color="greencolor.4">
                        <IconArrowsDiagonal size={14} stroke={1.5} />
                    </ActionIcon>
                </Flex>

                <Modal
                    opened={opened}
                    onClose={close}
                    title="Description"
                    centered
                    radius="xs"
                    size="90%"
                    padding="lg"
                    className={styles.scrollBar}
                >
                    <Text>
                        <div
                            dangerouslySetInnerHTML={{ __html: eventData?.description.toString() || "" }}
                        />
                    </Text>
                </Modal>
            </>
        );
    };

    return (
        <body>
            <AspectRatio ratio={970 / 150} maw="100vw">
                <Image src={thumbnailUrl} height={200} />
            </AspectRatio>

            <Box w="80%" mx="auto" style={{ position: "relative" }}>
                <Grid justify="flex-start" align="flex-start" mt="xl" mb="md">
                    <Grid.Col span={12}>
                        <div>
                            <Text size="header" c="greencolor.4" fw={600} mb="xs">
                                {eventData?.event_name}
                            </Text>
                            <Flex gap="2rem">
                                <div>
                                    <Text size="xsmall" c="graycolor.2" mb="xs">
                                        Start of event
                                    </Text>
                                    {moment(eventData?.start_date).format("LL [at] HH:mm A")}
                                </div>
                                <div>
                                    <Text size="xsmall" c="graycolor.2" mb="xs">
                                        End of event
                                    </Text>
                                    {moment(eventData?.start_date).format("LL [at] HH:mm A")}
                                </div>
                            </Flex>

                            <Badge color="greencolor.4" style={{ position: "absolute", top: "0.25rem", right: "0" }}>
                                {moment(eventData?.end_date).fromNow()}
                            </Badge>
                        </div>
                    </Grid.Col>

                    <Grid.Col my="md">
                        <Paper
                            withBorder
                            p="md"
                            radius="md"
                            bg="none"
                            h="max-content"
                        >
                            <Group justify="space-between">
                                <Text c="graycolor.2">All virtual money</Text>
                                <IconCoins size={16} />
                            </Group>

                            <Group align="flex-end" gap="xs" mt={25}>
                                <Text fw={500} c="greencolor.4">
                                    {guestData?.virtual_money.toLocaleString()}{" "}
                                    {eventData?.unit_money}
                                </Text>
                            </Group>

                            <Text fz="xs" c="dimmed" mt={7}>
                                Your Virtual Money
                            </Text>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <ModalDescription />
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <ProjectsDashboard eventId={eventData?.id.toString()} />
                    </Grid.Col>
                </Grid>
            </Box>
        </body>
    );
}
