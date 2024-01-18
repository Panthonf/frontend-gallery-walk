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
        const url = `${
          import.meta.env.VITE_FRONTEND_ENDPOINT
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
    // {
    //   title: "Guests",
    //   icon: "guests",
    //   value: "1234",
    //   label: "Number of guests",
    // },
    // {
    //   title: "All virtual money",
    //   icon: "money",
    //   value: "745",
    //   label: "Number of virtual money",
    // },
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

  const [opened, { toggle }] = useDisclosure(false);
  const [addProjectOpened, { toggle: toggleAddProject }] = useDisclosure(false);

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

  return (
    <body>
      {/* navbar */}
      {/* <Navbar activeIndex={activeNavbarIndex} /> */}

      <AspectRatio ratio={728 / 90} maw="100vw">
        {thumbnails && thumbnails && (
          <Image src={thumbnails} alt={`Thumbnail for ${thumbnails}`} />
        )}
      </AspectRatio>

      <Grid justify="center" align="center" w="95%">
        <Grid.Col span={12} style={{ position: "absolute", top: "5rem" }}>
          <Grid w="95%" m="auto" justify="space-between" grow>
            <Grid.Col span={3}>
              <a href="/dashboard">
                <Button size="xs" leftSection={<IconArrowLeft size={14} />}>
                  <Text c="pinkcolor.1" size="small">
                    Back
                  </Text>
                </Button>
              </a>
            </Grid.Col>

            <Grid.Col span={3} offset={3}>
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
                    <ActionIcon
                      variant="default"
                      size="lg"
                      aria-label="Settings"
                      onClick={() => clipboard.copy(event?.id.toString())}
                    >
                      {clipboard.copied ? (
                        <IconCopyCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
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
            </Grid.Col>
          </Grid>

          <Card className={styles.cardContainer} mx="auto">
            <Grid>
              <Grid.Col span={8}>
                <Text c="redcolor.4" fw={500} size="topic" mb="xs">
                  {event?.event_name}
                </Text>
                <Flex>
                  <Box>
                    <Flex mb="md" gap="2rem">
                      <div>
                        <Text mb="xs" c="graycolor.3">
                          Start event
                        </Text>
                        <Text>
                          {moment(event?.start_date).format(
                            "MMMM Do YYYY HH:mm A"
                          )}
                        </Text>
                      </div>
                      <div>
                        <Text mb="xs" c="graycolor.3">
                          End event
                        </Text>
                        <Text>
                          {moment(event?.end_date).format(
                            "MMMM Do YYYY, HH:mm A"
                          )}
                        </Text>
                      </div>
                    </Flex>
                    <Flex mb="md" gap="2rem">
                      <div>
                        <Text mb="xs" c="graycolor.3">
                          Start submit project
                        </Text>
                        <Text>
                          {moment(event?.submit_start).format(
                            "MMMM Do YYYY HH:mm A"
                          )}
                        </Text>
                      </div>
                      <div>
                        <Text mb="xs" c="graycolor.3">
                          End submit project
                        </Text>
                        <Text>
                          {moment(event?.submit_end).format(
                            "MMMM Do YYYY, HH:mm A"
                          )}
                        </Text>
                      </div>
                    </Flex>
                    <Box mb="md">
                      <Text w={500} c="graycolor.3" mb="xs">
                        Virtual Money
                      </Text>
                      <Text>
                        {event?.virtual_money} {event?.unit_money}
                      </Text>
                    </Box>
                  </Box>
                  <Grid.Col span="auto">
                    <SimpleGrid cols={{ base: 1, sm: 1 }}>{stats}</SimpleGrid>
                    {/* <Text mt="md">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Nihil culpa neque atque deleniti veritatis provident ipsa
                      itaque perferendis!
                    </Text> */}
                  </Grid.Col>
                </Flex>
                {/* <Box mb="md">
                                        <Text w={500} c="graycolor.3" mb="xs">Description</Text>
                                        <Text>{event?.description}</Text>
                                    </Box> */}
              </Grid.Col>
              <Grid.Col span="content" m="auto">
                <Card shadow="md" w="auto">
                  <Flex align="center">
                    <Text c="graycolor.3">For guest:</Text>
                    <Text mx="md">
                      <Anchor
                        target="_blank"
                        href={`${
                          import.meta.env.VITE_BASE_ENDPOINTMENT
                        }guests/events?eventId=${eventId}`}
                      >
                        {import.meta.env.VITE_BASE_ENDPOINTMENT}
                        guests/events?eventId={eventId}
                      </Anchor>
                    </Text>
                    <ActionIcon
                      variant="default"
                      size="lg"
                      aria-label="Settings"
                      onClick={() =>
                        guestClipboard.copy(
                          `${
                            import.meta.env.VITE_BASE_ENDPOINTMENT
                          }guests/events?eventId=${eventId}`
                        )
                      }
                    >
                      {guestClipboard.copied ? (
                        <IconCopyCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Flex>

                  <Flex align="center" mt="md">
                    <Text c="graycolor.3">For presenter:</Text>
                    <Text mx="md">
                      <Anchor
                        target="_blank"
                        href={`${
                          import.meta.env.VITE_BASE_ENDPOINTMENT
                        }presenters/${eventId}`}
                      >
                        {import.meta.env.VITE_BASE_ENDPOINTMENT}presenters/
                        {eventId}
                      </Anchor>
                    </Text>
                    <ActionIcon
                      variant="default"
                      size="lg"
                      aria-label="Settings"
                      onClick={() =>
                        presenterClipboard.copy(
                          `${
                            import.meta.env.VITE_BASE_ENDPOINTMENT
                          }presenters/${eventId}`
                        )
                      }
                    >
                      {presenterClipboard.copied ? (
                        <IconCopyCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Flex>
                </Card>
                {/* <Image src={qrCodeDataUrl} alt="QR Code" w="250" /> */}
              </Grid.Col>
            </Grid>
          </Card>

          <Box w="95%" p="xl" m="auto">
            <Group justify="flex-start" mb={5}>
              <UnstyledButton onClick={toggle}>
                <Group align="center">
                  <Text>Description</Text>
                  {opened ? (
                    <IconChevronDown size={16} />
                  ) : (
                    <IconChevronUp size={16} />
                  )}
                </Group>
              </UnstyledButton>
            </Group>

            <Collapse in={opened} mt="md">
              <Text>
                <div
                  dangerouslySetInnerHTML={{
                    __html: event?.description?.toString() || "",
                  }}
                />
              </Text>
            </Collapse>

            <Card mt="md" shadow="lg">
              <Button
                onClick={toggleAddProject}
                variant="outline"
                leftSection={<IconPlus size={16} />}
              >
                Add Project
              </Button>

              <Modal
                title="Create New Project"
                opened={addProjectOpened}
                onClose={toggleAddProject}
              >
                <Title order={1}>Create New Project</Title>
                <form
                  onSubmit={form.onSubmit(() => {
                    onSubmit();
                  })}
                >
                  <TextInput
                    mt="md"
                    label="Title"
                    placeholder="Project Title"
                    required
                    {...form.getInputProps("title")}
                  />

                  <Title order={6} mt="lg">
                    Description
                  </Title>
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
                  <Button radius="md" mt="lg" type="submit">
                    Submit
                  </Button>
                </form>
              </Modal>
            </Card>

            <Card className={styles.cardContainer} shadow="lg">
              <Center>
                <TextInput
                  w={600}
                  my="md"
                  placeholder="Search"
                  leftSection={
                    <IconSearch
                      style={{ width: rem(20), height: rem(20) }}
                      stroke={1.5}
                    />
                  }
                  value={query}
                  onChange={(project) => setQuery(project.target.value)}
                />
                <Select
                  ml="md"
                  searchable
                  w="80"
                  placeholder={pageSize.toString()}
                  data={["5", "10", "15", "20"]}
                  defaultValue="5"
                  onChange={(value) => {
                    setPageSize(value === null ? 5 : Number(value));
                    setPage(1);
                  }}
                  onSearchChange={(value) => {
                    setPageSize(value === null ? 5 : Number(value));
                    setPage(1);
                  }}
                />
              </Center>
              <Title>Projects</Title>
              {projects ? (
                <div>
                  <Text size="md" my="md" fw={500}>
                    {totalProjects} Projects
                  </Text>
                  {projects.map((project: ProjectType) => (
                    <Card radius="lg" key={project.id} shadow="md" mb="md">
                      <Text size="lg" fw={700}>
                        {project.title}
                      </Text>
                      <Text mt="md" truncate>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: project.description,
                          }}
                        />
                      </Text>
                      <Text size="md" c="gray" mt="sm">
                        {project.virtual_money} {event?.unit_money}
                      </Text>
                      <Text size="md" c="gray" mt="sm">
                        {moment(project?.created_at).format(
                          "MMMM Do YYYY HH:mm A"
                        )}
                      </Text>
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
                <Pagination
                  total={Math.ceil(totalProjects / pageSize)}
                  boundaries={2}
                  value={page}
                  onChange={(newPage) => setPage(newPage)}
                />
              </Center>
            </Card>
          </Box>
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
    </body>
  );
}
