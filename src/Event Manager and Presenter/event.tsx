import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Text,
    Card,
    Flex,
    Grid,
    Box,
    Image,
    ActionIcon,
    Menu,
    Group,
    Switch,
    Paper,
    SimpleGrid,
    Collapse,
    UnstyledButton,
    AspectRatio,
    Tooltip,
    Button,
    Title,
    TextInput,
    rem,
    Center,
    Select,
    Pagination,
    Anchor,
    Modal,
    Tabs,
    Container,
    Affix,
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";

import moment from "moment";

import styles from "../styles.module.css";
import QRCode from "qrcode";
import {
    IconArrowLeft,
    IconChevronDown,
    IconChevronUp,
    IconCoins,
    IconCopy,
    IconCopyCheck,
    IconDotsVertical,
    IconEdit,
    IconLayoutGridAdd,
    IconQrcode,
    IconTrash,
    IconUserQuestion,
    IconSearch,
    IconPlus,
    IconArrowsDiagonal,
    IconUserShare,
    IconSquarePlus,
    IconPhoto,
    IconMessageCircle,
    IconSettings,
    IconPresentationAnalytics,
    IconInfoSquare,
    IconChartBar,
    IconUsersGroup,
} from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Swal from "sweetalert2";
import Navbar from "../components/navbar";

interface EventType {
    id: number;
    event_name: string;
    start_date: string;
    submit_start: string;
    description: string;
    published: boolean;
    end_date: string;
    submit_end: string;
    video_link: string;
    number_of_member: number;
    virtual_money: number;
    unit_money: string;
    thumbnail_url: string;
}

type ProjectType = {
    created_at: string;
    virtual_money: number;
    map(
        arg0: (project: ProjectType) => import("react/jsx-runtime").JSX.Element
    ): import("react").ReactNode;
    id: number;
    title: string;
    description: string;
};

const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINTMENT;

export default function Event() {
    const { eventId } = useParams();
    const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");
    const clipboard = useClipboard({ timeout: 500 });
    const guestClipboard = useClipboard({ timeout: 500 });
    const presenterClipboard = useClipboard({ timeout: 500 });

    const [event, setEvent] = useState<EventType | null>(null);
    const [totalProjects, setTotalProjects] = useState(0);
    const [projects, setProjects] = useState<ProjectType | null>(null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        onUpdate() {
            if (editor) {
                form.setFieldValue("description", editor.getHTML());
            }
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios
                    .get(`http://localhost:8080/events/${eventId}`, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        // console.log(res.data.data);
                        // console.log(res.data.totalProjects);
                        setTotalProjects(res.data.totalProjects);
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

        const generateQRCode = async () => {
            try {
                const url = `${import.meta.env.VITE_FRONTEND_ENDPOINT
                    }/guest/event/${eventId}`;
                const dataUrl = await QRCode.toDataURL(url);
                setQRCodeDataUrl(dataUrl);
            } catch (error) {
                console.error("Error generating QR code:", error);
            }
        };

        const fetchProjectsData = async () => {
            await axios
                .get(`${BASE_ENDPOINT}presenters/get-project/${eventId}`, {
                    withCredentials: true,
                    params: { query, page, pageSize },
                })
                .then((res) => {
                    setProjects(res.data.data);
                    console.log("project data dd", res.data);
                })
                .catch((err) => {
                    console.log("projects err", err);
                });
        };

        if (eventId) {
            generateQRCode();
            fetchProjectsData();
        }

        document.title = `${event?.event_name} | Virtual Event Manager`;
    }, [eventId, event?.event_name, query, page, pageSize]);

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

    // stat container
    const icons = {
        projects: IconLayoutGridAdd,
        guests: IconUserQuestion,
        money: IconCoins,
    };

    const data = [
        {
            title: "Projects",
            icon: "projects",
            value: totalProjects,
            label: "Project from event presenter",
        },
        {
            title: "Guests",
            icon: "guests",
            value: "1234",
            label: "Number of guests",
        },
        {
            title: "All virtual money",
            icon: "money",
            value: "745",
            label: "Number of virtual money",
        },
    ];

    const stats = data.map((stat) => {
        const Icon = icons[stat.icon as keyof typeof icons];

        return (
            <Paper
                withBorder
                p="md"
                radius="md"
                key={stat.title}
                bg="none"
                h="max-content"
            >
                <Group justify="space-between">
                    <Text c="dimmed">{stat.title}</Text>
                    <Icon size={16} />
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text fw={500}>{stat.value}</Text>
                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    {stat.label}
                </Text>
            </Paper>
        );
    });

    const [addProjectOpened, { toggle: toggleAddProject }] = useDisclosure(false);
    // const [isOpened, { isopen, isclose }] = useDisclosure(false)

    const [thumbnails, setThumbnails] = useState<EventType | null>(null);

    useEffect(() => {
        const fetchThumbnails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/events/thumbnail/${eventId}`,
                    {
                        withCredentials: true,
                    }
                );

                const eventData = response.data.data[0];
                // console.log(eventData);
                setThumbnails(eventData.thumbnail_url);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchThumbnails();
    }, [eventId]);

    const form = useForm({
        initialValues: {
            title: "",
            description: "",
        },

        validate: {
            title: isNotEmpty("Title is required"),
            description: isNotEmpty("Description is required"),
        },
    });

    const onSubmit = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to create this project?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios
                        .post(
                            `${BASE_ENDPOINT}presenters/create-project/${eventId}`,
                            {
                                title: form.values.title,
                                description: form.values.description,
                            },
                            {
                                withCredentials: true,
                            }
                        )
                        .then((res) => {
                            console.log("dd", res.data);
                            Swal.fire({
                                title: "Success",
                                text: "Create project success",
                                icon: "success",
                                timer: 2000,
                                showConfirmButton: false,
                            }).then(() => {
                                window.location.reload();
                                // toggleAddProject();
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            Swal.fire({
                                title: "Error",
                                text: "Create project error",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                        });
                } catch (error) {
                    console.error("Error fetching events:", error);
                }
            }
        });
    };

    const ModalEvent = () => {
        const [opened, { open, close }] = useDisclosure(false);

        return (
            <>
                <Flex align="flex-end">
                    <Text lineClamp={5}>
                        <div dangerouslySetInnerHTML={{ __html: event?.description }} />
                    </Text>
                    <ActionIcon variant="subtle" onClick={open} color="redcolor.4">
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
                    className={styles.scrollBar} // Use your actual style class
                >
                    <Text><div dangerouslySetInnerHTML={{ __html: event?.description }} /></Text>
                </Modal>
            </>
        );
    };

    const ModalProject = ({ project }: { project: ProjectType }) => {
        const [opened, { open, close }] = useDisclosure(false);

        return (
            <>
                <Flex justify="space-between" align="end">
                    <Text
                        lineClamp={2}
                    ><div
                            dangerouslySetInnerHTML={{
                                __html: project.description,
                            }}
                        />
                    </Text>

                    <ActionIcon variant="subtle" onClick={open} color="redcolor.4">
                        <IconArrowsDiagonal size={14} stroke={1.5} />
                    </ActionIcon>
                </Flex>

                <Modal opened={opened} onClose={close} title="Description" centered
                    radius="xs" size="90%" padding="lg" className={styles.scrollBar}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: project.description,
                        }}
                    />
                </Modal>
            </>
        );
    };

    return (
        <body>
            {/* navbar */}
            <Navbar />

            {/* <Box w="80%" mx="auto" my="xl">
                <Flex justify="space-between" align="center">
                    <a href="/dashboard">
                        <Button size="xs" leftSection={<IconArrowLeft size={14} />}>
                            <Text c="pinkcolor.1" size="small">
                                Back
                            </Text>
                        </Button>
                    </a>
                    <Flex align="center" justify="flex-end" gap="md">
                        <Group>
                            <Tooltip label="Publish event" refProp="rootRef">
                                <Switch
                                    checked={isPublished}
                                    onChange={handlePublishToggle}
                                    onLabel="Pub"
                                    offLabel="Pv"
                                    id="publish-toggle"
                                    size="lg"
                                    color="greencolor.7"
                                />
                            </Tooltip>
                            <ActionIcon.Group>
                                <ActionIcon
                                    variant="default"
                                    size="lg"
                                    aria-label="Gallery"
                                >
                                    <IconQrcode size={16} />
                                </ActionIcon>
                                <Menu position="bottom-end" shadow="sm">
                                    <Menu.Target>
                                        <ActionIcon variant="default" size="lg">
                                            <IconCopy size={16} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<IconUserQuestion size={14} />} color="pinkcolor.2">
                                            <Anchor target="_blank"
                                                href={`${import.meta.env.VITE_BASE_ENDPOINTMENT
                                                    }guests/events?eventId=${eventId}`}
                                                underline="never"
                                                c="pinkcolor.2">
                                                Link for guest
                                            </Anchor>
                                        </Menu.Item>
                                        <Menu.Item leftSection={<IconUserShare size={14} />} color="deepredcolor.9">
                                            <Anchor
                                                target="_blank"
                                                href={`${import.meta.env.VITE_BASE_ENDPOINTMENT
                                                    }presenters/${eventId}`}
                                                underline="never"
                                                c="deepredcolor.9"
                                            >
                                                Link for presenter
                                            </Anchor>
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                                <Menu position="bottom-end" shadow="sm">
                                    <Menu.Target>
                                        <ActionIcon variant="default" size="lg">
                                            <IconDotsVertical size={16} />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item leftSection={<IconEdit size={14} />}>
                                            Edit event
                                        </Menu.Item>
                                        <Menu.Item
                                            leftSection={<IconTrash size={14} />}
                                            color="red"
                                        >
                                            Delete event
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </ActionIcon.Group>
                        </Group>
                    </Flex>
                </Flex>
            </Box> */}

            <div>
                <Affix position={{ top: 90, left: 20 }}>
                    <a href="/dashboard">
                        <Button size="xs" leftSection={<IconArrowLeft size={14} />}>
                            <Text c="pinkcolor.1" size="small">
                                Back
                            </Text>
                        </Button>
                    </a>
                </Affix>

                <Box w="80%" mx="auto">
                    <Flex justify="space-between" align="flex-start" my="xl">

                        <div>
                            <Text c="redcolor.4" fw={600} size="topic" mb="xs">
                                {event?.event_name}
                            </Text>
                            <Flex mb="md" gap="2rem">
                                <div>
                                    <Text size="xsmall" c="graycolor.3">
                                        Start of event
                                    </Text>
                                    <Text>
                                        {moment(event?.start_date).format(
                                            "LL [at] HH:mm A"
                                        )}
                                    </Text>
                                </div>
                                <div>
                                    <Text size="xsmall" c="graycolor.3">
                                        End of event
                                    </Text>
                                    <Text>
                                        {moment(event?.end_date).format(
                                            "LL [at] HH:mm A"
                                        )}
                                    </Text>
                                </div>
                            </Flex>
                        </div>
                        <Flex align="center" justify="flex-end" gap="md">
                            <Group>
                                <Tooltip label="Publish event" refProp="rootRef">
                                    <Switch
                                        checked={isPublished}
                                        onChange={handlePublishToggle}
                                        onLabel="Pub"
                                        offLabel="Pv"
                                        id="publish-toggle"
                                        size="lg"
                                        color="greencolor.7"
                                    />
                                </Tooltip>
                                <ActionIcon.Group>
                                    <ActionIcon
                                        variant="default"
                                        size="lg"
                                        aria-label="Gallery"
                                    >
                                        <IconQrcode size={16} />
                                    </ActionIcon>
                                    <Menu position="bottom-end" shadow="sm">
                                        <Menu.Target>
                                            <ActionIcon variant="default" size="lg">
                                                <IconCopy size={16} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item leftSection={<IconUserQuestion size={14} />} color="pinkcolor.2">
                                                <Anchor target="_blank"
                                                    href={`${import.meta.env.VITE_BASE_ENDPOINTMENT
                                                        }guests/events?eventId=${eventId}`}
                                                    underline="never"
                                                    c="pinkcolor.2">
                                                    Link for guest
                                                </Anchor>
                                            </Menu.Item>
                                            <Menu.Item leftSection={<IconUserShare size={14} />} color="deepredcolor.9">
                                                <Anchor
                                                    target="_blank"
                                                    href={`${import.meta.env.VITE_BASE_ENDPOINTMENT
                                                        }presenters/${eventId}`}
                                                    underline="never"
                                                    c="deepredcolor.9"
                                                >
                                                    Link for presenter
                                                </Anchor>
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                    <Menu position="bottom-end" shadow="sm">
                                        <Menu.Target>
                                            <ActionIcon variant="default" size="lg">
                                                <IconDotsVertical size={16} />
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item leftSection={<IconEdit size={14} />}>
                                                Edit event
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<IconTrash size={14} />}
                                                color="red"
                                            >
                                                Delete event
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </ActionIcon.Group>
                            </Group>
                        </Flex>
                    </Flex>

                </Box>

                <Tabs radius="xs" color="redcolor.4" defaultValue="gallery" w="80%" mx="auto" h="max-content">
                    <Tabs.List>
                        <Tabs.Tab value="gallery" leftSection={<IconInfoSquare size={14} />}>
                            Event Infomation
                        </Tabs.Tab>
                        <Tabs.Tab value="messages" leftSection={<IconPresentationAnalytics size={14} />}>
                            Projects
                            ({totalProjects})
                        </Tabs.Tab>
                        <Tabs.Tab value="settings" leftSection={<IconChartBar size={14} />} disabled>
                            Result
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="gallery">

                        <AspectRatio ratio={970 / 150} maw="100vw" mt="3rem">
                            {thumbnails && thumbnails && (
                                <Image src={thumbnails} alt={`Thumbnail for ${thumbnails}`} />
                            )}
                        </AspectRatio>

                        <Card className={styles.cardContainer} mx="auto" >
                            <Grid>
                                <Grid.Col span={4}>
                                    <Grid>
                                        <Grid.Col span={4}>
                                            <Text c="redcolor.4">Event Presenter</Text>
                                        </Grid.Col>
                                        <Grid.Col span={8}>
                                            <div>
                                                <Text size="xsmall" c="graycolor.3">
                                                    Start submit project
                                                </Text>
                                                <Text>
                                                    {moment(event?.submit_start).format(
                                                        "LL [at] HH:mm A"
                                                    )}
                                                </Text>
                                                <Text size="xsmall" c="graycolor.3">
                                                    End submit project
                                                </Text>
                                                <Text>
                                                    {moment(event?.submit_end).format(
                                                        "LL [at] HH:mm A"
                                                    )}
                                                </Text>
                                            </div>
                                        </Grid.Col>

                                        <Grid.Col span={4}>
                                            <Text c="redcolor.4">Guest</Text>
                                        </Grid.Col>
                                        <Grid.Col span={8}>
                                            <div>
                                                <Text size="xsmall" c="graycolor.3">Virtual Money</Text>
                                                <Text>{event?.virtual_money} {event?.unit_money}</Text>
                                            </div>
                                        </Grid.Col>
                                    </Grid>
                                </Grid.Col>


                                <Grid.Col span="auto">
                                    <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
                                </Grid.Col>

                                <Grid.Col mb="md">
                                    <Text w={500} c="graycolor.3" mb="xs">Description</Text>

                                    <ModalEvent />

                                </Grid.Col>
                            </Grid>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="messages" mt="3rem">
                        <Box w="100%" mx="auto">
                            <Flex justify="space-between" align="flex-start">

                                <Button
                                    size="sm"
                                    leftSection={<IconSquarePlus size={14} />}
                                    onClick={toggleAddProject}>
                                    <Text c="pinkcolor.1" size="small">
                                        Add Project
                                    </Text>
                                </Button>

                                <Modal
                                    title="Create New Project"
                                    opened={addProjectOpened}
                                    onClose={toggleAddProject}
                                    centered
                                    size="80%"
                                >
                                    <form
                                        onSubmit={form.onSubmit(() => {
                                            onSubmit();
                                        })}
                                    >

                                        <TextInput
                                            label="Title"
                                            placeholder="Project Title"
                                            required
                                            {...form.getInputProps("title")}
                                        />

                                        <Text size="base" mt="md" fw={500}>
                                            Description
                                        </Text>

                                        <RichTextEditor mt="xs" editor={editor}>
                                            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.Bold />
                                                    <RichTextEditor.Italic />
                                                    <RichTextEditor.Underline />
                                                    <RichTextEditor.Strikethrough />
                                                    <RichTextEditor.ClearFormatting />
                                                    <RichTextEditor.Highlight />
                                                    <RichTextEditor.Code />
                                                </RichTextEditor.ControlsGroup>
                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.H1 />
                                                    <RichTextEditor.H2 />
                                                    <RichTextEditor.H3 />
                                                    <RichTextEditor.H4 />
                                                </RichTextEditor.ControlsGroup>
                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.Blockquote />
                                                    <RichTextEditor.Hr />
                                                    <RichTextEditor.BulletList />
                                                    <RichTextEditor.OrderedList />
                                                    <RichTextEditor.Subscript />
                                                    <RichTextEditor.Superscript />
                                                </RichTextEditor.ControlsGroup>
                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.Link />
                                                    <RichTextEditor.Unlink />
                                                </RichTextEditor.ControlsGroup>
                                                <RichTextEditor.ControlsGroup>
                                                    <RichTextEditor.AlignLeft />
                                                    <RichTextEditor.AlignCenter />
                                                    <RichTextEditor.AlignJustify />
                                                    <RichTextEditor.AlignRight />
                                                </RichTextEditor.ControlsGroup>
                                            </RichTextEditor.Toolbar>
                                            <RichTextEditor.Content
                                                {...form.getInputProps("description")}
                                            />
                                        </RichTextEditor>
                                        <Text mt="sm" c="red">
                                            {form.errors.description && <>{form.errors.description}</>}
                                        </Text>

                                        <Box ta="end">
                                            <Button
                                                type="submit"
                                                size="sm"
                                                mt="md">
                                                <Text c="pinkcolor.1" size="small">
                                                    Submit
                                                </Text>
                                            </Button>
                                        </Box>
                                    </form>
                                </Modal>

                                <TextInput
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search project"
                                    rightSection={<IconSearch size={14} />}
                                    w="50%"
                                />
                            </Flex>

                            <div style={{ height: "100vh" }}>
                                {projects ? (
                                    <div>
                                        {projects.map((project: ProjectType) => (
                                            <Card key={project.id} className={styles.cardContainer} p="lg">
                                                <Grid align="flex-start" gutter="2rem">
                                                    <Grid.Col span={3}>
                                                        <Text size="xsmall" c="graycolor.2">Project name</Text>
                                                        <Text size="base" fw={500}>
                                                            {project.title}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span="auto">
                                                        <Text size="xsmall" c="graycolor.2">Description</Text>
                                                        <ModalProject project={project} />
                                                    </Grid.Col>
                                                    <Grid.Col span={1.5}>
                                                        <Text size="xsmall" c="graycolor.2" mb="0.5rem">Participants</Text>
                                                        <Flex align="center" c="redcolor.4">
                                                            <IconUsersGroup size={14} />
                                                            <Text ml="md">0</Text>
                                                        </Flex>
                                                    </Grid.Col>
                                                    <Grid.Col span="content" ta="end">
                                                        <Text size="small" c="gray">
                                                            {project.virtual_money} {event?.unit_money}
                                                        </Text>
                                                        <Text size="small" c="gray">
                                                            {moment(project?.created_at).format(
                                                                "LL [at] HH:mm A"
                                                            )}
                                                        </Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <Text size="md" my="md" fw={500}>
                                            No Projects
                                        </Text>
                                    </div>
                                )}

                                <Center mt="md">
                                    <Pagination.Root
                                        color="redcolor.4"
                                        size="sm"
                                        total={Math.ceil(totalProjects / pageSize)}
                                        boundaries={2}
                                        value={page}
                                        onChange={(newPage) => setPage(newPage)}
                                    >
                                        <Group gap={5} justify="center">
                                            <Pagination.First />
                                            <Pagination.Previous />
                                            <Pagination.Items />
                                            <Pagination.Next />
                                            <Pagination.Last />
                                        </Group>
                                    </Pagination.Root>
                                </Center>
                            </div>
                        </Box>
                    </Tabs.Panel>

                    <Tabs.Panel value="settings">
                        Settings tab content
                    </Tabs.Panel>
                </Tabs>

                <div className={styles.footer}></div>
            </div>



            {/* <div className={styles.footer}></div> */}

            {/* red footer */}
            {/* <Affix className={styles.footer}></Affix> */}

        </body>
    );
}
