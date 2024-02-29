import { useEffect, useState } from "react";
import {
    Divider,
    Grid,
    Group,
    Menu,
    Text,
    UnstyledButton,
    rem,
    Image,
    Avatar,
    Flex,
    Burger,
} from "@mantine/core";
import {
    IconChevronDown,
    //   IconHeart,
    IconLogout,
    //   IconMessage,
    //   IconPlayerPause,
    IconSettings,
    //   IconStar,
    //   IconSwitchHorizontal,
    //   IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";

type UserType = {
    first_name_en: string;
    last_name_en: string;
    profile_pic: string;
};

export default function Navbar() {
    const [, setUserMenuOpened] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(null);
    const [opened, { toggle }] = useDisclosure(false);

    useEffect(() => {
        if (!userData) {
            const fetchUserData = async () => {
                await axios
                    .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}users/profile`, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        setUserData(res.data);
                    })
                    .catch(() => {
                        // console.log("Error");
                    });
            };
            fetchUserData();
        }
    });

    const handleLogout = async () => {
        await axios
            .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}users/logout`, {
                withCredentials: true,
            })
            .then((res) => {
                console.log("logout", res.data);
                if (res.data.success === true) {
                    window.location.href = "/";
                }
            })
            .catch(() => {
                // console.log("Error");
            });
    };

    return (
        <body>
            <div
                style={{
                    padding: "1rem",
                    height: "3.5rem"
                }}
            >
                <Grid justify="flex-start" gutter="2rem" align="center">
                    <Grid.Col span="content">
                        <Flex align="center" gap="md">
                            <Image
                                w={30}
                                src="/src/images/icon-1.PNG"
                            />
                            <Text fw={500}>Gallery walk</Text>
                        </Flex>
                    </Grid.Col>

                    <Grid.Col span="auto">
                        <a href="/dashboard">
                            <UnstyledButton mr="lg">
                                <Text>Dashboard</Text>
                            </UnstyledButton>
                        </a>
                    </Grid.Col>

                    <Grid.Col span={4} ta="end">
                        <Group justify="flex-end">
                            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

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
                                        <Group>
                                            <Flex align="center" gap="md">
                                                {userData?.profile_pic ? (
                                                    <Image
                                                        src={userData?.profile_pic}
                                                        alt="User avatar"
                                                        radius="xl"
                                                        width={25}
                                                        height={25}
                                                    />
                                                ) : (
                                                    <Avatar radius="xl" />
                                                )}
                                                <Text ml="5">
                                                    {userData ? (
                                                        <>
                                                            <Text>{userData.first_name_en} {userData.last_name_en}</Text>
                                                        </>
                                                    ) : (
                                                        <Text>"Loading..."</Text>
                                                    )}
                                                </Text>
                                            </Flex>
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
                                            <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                        }
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Menu.Item>

                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Grid.Col>
                </Grid>
            </div>

            <Divider size="xs" />
        </body>
    );
}
