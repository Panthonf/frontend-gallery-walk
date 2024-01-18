import { useEffect, useState } from "react";

import axios from "axios";
import {
    Anchor,
    Card,
    // Center,
    Collapse,
    Flex,
    // Progress,
    Text,
    Title,
    Image,
    Divider,
    Grid,
    Select,
    Container,
    SimpleGrid,
    Button,
    AspectRatio,
    Stack,
    ActionIcon,
    Menu,
    Box,
    Group,
    UnstyledButton,
    Modal,
} from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles.module.css"
import ProjectsDashboard from "./projectsDashboard";
import moment from "moment";
import { useDisclosure } from "@mantine/hooks";
import { LoadingIndicator } from "../components/loading";
import { IconArrowNarrowRight, IconArrowsDiagonal, IconArrowsJoin, IconChevronDown, IconChevronUp, IconCopyCheck, IconDotsVertical, IconEdit, IconEye, IconQrcode, IconSquarePlus, IconTrash } from "@tabler/icons-react";
import { relative } from "path";

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
    const guestId = useLocation().search.split("=")[1];
    const navigate = useNavigate();
    const [eventData, setEventData] = useState<EventType | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(
        `https://placehold.co/400?text${eventId}`
    );
    // const [opened, { toggle }] = useDisclosure(false);
    const [isLoading, setIsLoading] = useState(true);
    const [guestData, setGuestData] = useState<GuestType | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [isOpened, { toggle }] = useDisclosure(false);

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
                        `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/get-guest-data`,
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

    return (
        <body style={{  }}>
            <AspectRatio ratio={320 / 100} maw="100vw" >
                <Image src={thumbnailUrl} height={200} />
            </AspectRatio>

            <Grid w="100%" style={{ height: "10rem" }} p="xl">

                <Grid.Col span={12} h="max-content">
                    <Card p="xl" className={styles.cardContainer} style={{ top: "-7rem" }}>

                        <div style={{ marginBottom: "1rem" }}>
                            <Text size="topic" c="redcolor.4" fw={500}>
                                {eventData?.event_name}
                            </Text>
                            <Text mt="5" c="graycolor.2">
                                {`${moment(eventData?.start_date).format(
                                    "MMMM Do YY HH:mm A"
                                )} - ${moment(eventData?.end_date).format("MMMM Do YY HH:mm A")}`}
                            </Text>
                        </div>

                        <div>
                            <Text fw={500} c="darkcolor.9">
                                Your Virtual Money
                            </Text>
                            <Text size="base" c="redcolor.4">
                                {guestData?.virtual_money.toLocaleString()} {eventData?.unit_money}
                            </Text>
                        </div>

                        <Divider size="xs" mt="md" color="graycolor.2" />
                        <Box mt="1rem">

                            <Group justify="flex-start" mb={5}>
                                <UnstyledButton onClick={toggle}>
                                    <Group align="center">
                                        <Text>Description</Text>
                                        {isOpened ? (
                                            <IconChevronDown size={16} />
                                        ) : (
                                            <IconChevronUp size={16} />
                                        )}
                                    </Group>
                                </UnstyledButton>
                            </Group>

                            <Collapse in={isOpened}>
                                <Flex align="flex-end">
                                    <Text
                                        lineClamp={5}
                                        dangerouslySetInnerHTML={{
                                            __html: eventData?.description.toString() || "",
                                        }}
                                    ></Text>
                                    <ActionIcon variant="subtle" onClick={open} color="redcolor.4">
                                        <IconArrowsDiagonal size={14} stroke={1.5} />
                                    </ActionIcon>
                                </Flex>

                                <Modal opened={opened} onClose={close} title="Description" centered
                                    radius="xs" size="95%" padding="lg" className={styles.scrollBar}
                                >
                                    <div dangerouslySetInnerHTML={{
                                        __html: eventData?.description.toString() || "",
                                    }}></div>

                                    <Flex mt="md" justify="flex-start">
                                        {eventData?.video_link ? (
                                            <Anchor href={eventData?.video_link} underline="always">
                                                Video Link
                                            </Anchor>
                                        ) : (
                                            ""
                                        )}
                                    </Flex>{" "}
                                </Modal>
                            </Collapse>
                        </Box>
                    </Card>
                </Grid.Col>

            </Grid>
            
                <ProjectsDashboard eventId={eventData?.id.toString()} />
        </body >
    );
}
