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

type UserType = {
    first_name_en: string;
    last_name_en: string;
    profile_pic: string;
};

export default function Navbar() {
    const [, setUserMenuOpened] = useState(false);
    const [userData, setUserData] = useState<UserType | null>(null);

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
                }}
            >
                <Grid justify="space-between">
                    <Grid.Col span={1}>
                        <Text>Gallery walk</Text>
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
                            transitionProps={{ transition: "pop-top-right" }}
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                            withinPortal
                        >
                            <Menu.Target>
                                <UnstyledButton>
                                    <Group gap={7}>
                                      
                                        {userData?.profile_pic ? (
                                            <Image
                                                src={userData?.profile_pic}
                                                alt="User avatar"
                                                radius="xl"
                                                width={32}
                                                height={32}
                                            />
                                        ) : (
                                            <Avatar radius="xl" />
                                        )}
                                        <Text ml="5">
                                            {userData ? (
                                                <>
                                                    {userData.first_name_en} {userData.last_name_en}
                                                </>
                                            ) : (
                                                "Loading..."
                                            )}
                                        </Text>

                                        <IconChevronDown
                                            style={{ width: rem(12), height: rem(12) }}
                                            stroke={1.5}
                                        />
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown>
                                
                                <Menu.Item
                                    leftSection={
                                        <IconSettings
                                            style={{ width: rem(16), height: rem(16) }}
                                            stroke={1.5}
                                        />
                                    }
                                >
                                    Account settings
                                </Menu.Item>
                              
                                <Menu.Item
                                    leftSection={
                                        <IconLogout
                                            style={{ width: rem(16), height: rem(16) }}
                                            stroke={1.5}
                                        />
                                    }
                                    onClick={handleLogout}
                                >
                                    Logout
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
