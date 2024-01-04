import React from 'react';
import { useEffect, useState } from "react";
import QRCode from 'qrcode.react';
import { useParams } from "react-router-dom";
import axios from "axios";
import { Text, Card, Title, Switch, Flex, Anchor, Grid, Box } from "@mantine/core";

import moment from "moment";

import styles from "../styles.module.css";

interface EventType {
    event_name: string;
    start_date: string;
    description: string;
    published: boolean;
}


export default function Event() {
    const { eventId } = useParams();

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

                    <Card
                        className={styles.cardContainer}
                        p="1rem"
                        radius="md"
                    >
                        <Text c="redcolor.4" fw={500} size="topic" mb="xs">
                            {event?.event_name}
                        </Text>

                        <Flex mb="md" gap="2rem">
                            <div>
                                <Text mb="xs" c="graycolor.3">Start event</Text>
                                <Text>
                                    {moment(event?.start_date).format("MMMM Do YYYY, HH:mm A")}
                                </Text>
                            </div>

                            <div>
                                <Text mb="xs" c="graycolor.3">End event</Text>
                                <Text>
                                    {moment(event?.end_date).format("MMMM Do YYYY, HH:mm A")}
                                </Text>
                            </div>
                        </Flex>

                        <Box mb="md">
                            <Text w={500} c="graycolor.3" mb="xs">Description</Text>
                            <Text>{event?.description}</Text>
                        </Box>

                        

                    </Card>

                </Grid.Col>

                <Grid.Col span={12}>

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
        </body >

    );
}
