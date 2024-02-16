import { useState } from 'react';
import {  Divider, Grid, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import {
    IconChevronDown,
    IconLogout,
    IconSettings,
    IconSwitchHorizontal,
    IconTrash,

} from '@tabler/icons-react';



export default function Navbar() {

    const [, setUserMenuOpened] = useState(false);

    return (
        <body>
            <div style={{
                position: "fixed",
                width: "100%",
                padding: "1.5rem"
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
                                    color="red"
                                    leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                >
                                    Delete account
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Grid.Col>
                </Grid>

                <Divider size="xs" mt="1rem" />
            </div>

        </body>
    );

}