import React, { useState } from 'react';

import { Text, Container, Divider, Grid, Tabs, Select, Button, Flex } from '@mantine/core';
import Navbar from "../components/navbar";

import styles from "../components/styles.module.css";

import {
    IconSquarePlus,
    IconArrowsJoin,
    
} from "@tabler/icons-react";

export default function Dashboard() {

    const [activeTab, setActiveTab] = useState("Overview");
    const [activeNavbarIndex, setActiveNavbarIndex] = useState(0);

    const handleSelectChange = (value: string) => {
        setActiveTab(value);
    };

    return (
        <body style={{
            display: "flex",
        }}>
            {/* navbar */}
            <Navbar activeIndex={activeNavbarIndex} />
            
            <Grid w="100%" p="xl">
                <Grid.Col span={12}>
                    <Text c="redcolor.4" fw={500} size="topic">
                        Dashboard
                    </Text>

                </Grid.Col>
                <Grid.Col span={12}>

                    {activeTab === "Overview" && <div>

                        <Grid justify="space-between">
                            <Grid.Col span={6}>


                            </Grid.Col>
                            {/* <Autocomplete
                                className={classes.search}
                                placeholder="Search"
                                leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
                                visibleFrom="xs"
                            /> */}
                            <Grid.Col span={6}>
                                <Flex gap="lg" justify="end">
                                    <Button
                                        color="redcolor.4"
                                        size="sm"
                                        w="20%"
                                        justify="center"
                                        variant="filled"
                                        rightSection={
                                            <IconSquarePlus size={14} />
                                        }
                                    >
                                        <Text c="pinkcolor.1">
                                            Create Event!
                                        </Text>
                                    </Button>
                                    <Button
                                        color="deepredcolor.9"
                                        size="sm"
                                        w="20%"
                                        justify="center"
                                        variant="filled"
                                        rightSection={
                                            <IconArrowsJoin size={14} />
                                        }
                                    >
                                        <Text c="pinkcolor.1">
                                            Join event
                                        </Text>
                                    </Button>
                                </Flex>
                            </Grid.Col>

                        </Grid>

                    </div>}
                    {activeTab === "Event Manager" && <div>Messages Content for Select</div>}
                    {activeTab === "Presenter" && <div>Settings Content for Select</div>}
                </Grid.Col>
            </Grid>
        </body>
    );

}