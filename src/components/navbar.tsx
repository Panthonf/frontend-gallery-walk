import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Center, Tooltip, UnstyledButton, Stack, rem, Container } from '@mantine/core';
import {
    IconLayoutDashboard,
    IconSquarePlus,

} from '@tabler/icons-react';

import styles from "./styles.module.css";

interface NavbarLinkProps {
    icon: typeof IconLayoutDashboard;
    label: string;
    active?: boolean;
    onClick?(): void;
}

interface NavbarProps {
    activeIndex: number;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={styles.link} data-active={active || undefined}>
                <Icon style={{ width: rem(20), height: rem(20), padding: rem(1) }} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconLayoutDashboard, label: 'Dashboard' },
    { icon: IconSquarePlus, label: 'Create-Event' },
];

export default function Navbar({ activeIndex }: NavbarProps) {

    const [active, setActive] = useState(0);

    const links = mockdata.map((link, index) => (
        <NavLink
            to={`/${link.label.toLowerCase()}`}
            key={link.label}
            className={styles.link}
        >
            <NavbarLink
                {...link}
                active={index === activeIndex}
                onClick={() => setActive(index)}
            />
        </NavLink>
    ));

    return (
        <body>
            <Container p="xl" style={{
                height: "100vh",
            }}>
                <Center>

                </Center>

                <div className={styles.navbarMain}>
                    <Stack justify="center" gap={0}>
                        {links}
                    </Stack>
                </div>


            </Container>
        </body>
    );

}

{/* <div className={styles.navbarMain}>
                    <Stack justify="center" gap={0}>
                        {links}
                    </Stack>
                </div> */}
{/* <nav className={styles.navbar}>
                    <Center>
                    </Center>
                    <div className={styles.navbarMain}>
                        <Stack justify="center" gap={0}>
                            {links}
                        </Stack>
                    </div>
                    <Stack justify="center" gap={0}>
                        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
                        <NavbarLink icon={IconLogout} label="Logout" />
                    </Stack>
                </nav> */}