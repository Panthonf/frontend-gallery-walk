import { useState } from 'react';
import {  Divider, Grid, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import {
    IconChevronDown,
    IconHeart,
    IconLogout,
    IconMessage,
    IconPlayerPause,
    IconSettings,
    IconStar,
    IconSwitchHorizontal,
    IconTrash,

} from '@tabler/icons-react';



export default function Navbar() {

    const [, setUserMenuOpened] = useState(false);

    return (
        <body>
            <div style={{
                padding: "1rem"
            }}>
                <Grid justify="space-between">
                    <Grid.Col span={1}>
                        <Text>
                            Gallery walk
                        </Text>
                    </Grid.Col>

                    <Grid.Col span="auto">
                        <a href="/dashboard">
                            <UnstyledButton mr="lg">
                                <Text>Dashboard</Text>
                            </UnstyledButton>
                        </a>

                        <a href="/create-event">
                            <UnstyledButton>
                                <Text>Create Event</Text>
                            </UnstyledButton>
                        </a>

                    </Grid.Col>

                    <Grid.Col span={4} ta="end">
                        <Menu
                            width={260}
                            position="bottom-end"
                            transitionProps={{ transition: 'pop-top-right' }}
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                            withinPortal
                        >
                            <Menu.Target>
                                <UnstyledButton>
                                    <Group gap={7}>
                                        {/* <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                                        <Text fw={500} size="sm" lh={1} mr={3}>
                                            {user.name}
                                        </Text> */}
                                        <Text>Panthon Kansap</Text>
                                        <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={
                                        <IconHeart
                                            style={{ width: rem(16), height: rem(16) }}

                                            stroke={1.5}
                                        />
                                    }
                                >
                                    Liked posts
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={
                                        <IconStar
                                            style={{ width: rem(16), height: rem(16) }}

                                            stroke={1.5}
                                        />
                                    }
                                >
                                    Saved posts
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={
                                        <IconMessage
                                            style={{ width: rem(16), height: rem(16) }}

                                            stroke={1.5}
                                        />
                                    }
                                >
                                    Your comments
                                </Menu.Item>

                                <Menu.Label>Settings</Menu.Label>
                                <Menu.Item
                                    leftSection={
                                        <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                    }
                                >
                                    Account settings
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={
                                        <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                    }
                                >
                                    Change account
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={
                                        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                    }
                                >
                                    Logout
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Label>Danger zone</Menu.Label>
                                <Menu.Item
                                    leftSection={
                                        <IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                    }
                                >
                                    Pause subscription
                                </Menu.Item>
                                <Menu.Item
                                    color="red"
                                    leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                >
                                    Delete account
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Grid.Col>
                </Grid>
            </div>

            <Divider size="xs" />

        </body>
    );

}