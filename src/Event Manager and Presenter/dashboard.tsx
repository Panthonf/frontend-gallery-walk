import {
  // ChangeEvent,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import {
  Text,
  Divider,
  Grid,
  Card,
  Button,
  Flex,
  TextInput,
  // Select,
  Group,
  Container,
  SimpleGrid,
  Menu,
  ActionIcon,
  Anchor,
  AspectRatio,
  Stack,
  //   UnstyledButton,
} from "@mantine/core";
import { Pagination } from "@mantine/core";
import Navbar from "../components/navbar";
import moment from "moment";

import {
  useClipboard,
  // useToggle
} from "@mantine/hooks";

// import styles from "../components/styles.module.css";
// import { IconSearch, IconArrowRight } from '@tabler/icons-react';

import {
  IconSquarePlus,
  IconSearch,
  IconTrash,
  IconEye,
  IconDotsVertical,
  IconQrcode,
  IconCopy,
  IconCopyCheck,
  IconArrowNarrowRight,
  IconEdit,
} from "@tabler/icons-react";

import styles from "../styles.module.css";
import ProjectsDashboard from "./projectsDashboard";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [totalEvents, setTotalEvents] = useState(0);
  const [events, setEvents] = useState([]);

  const [activeTab, setActiveTab] = useState("Event manager");
  //   const [value, toggle] = useToggle(["Event manager", "Presenter"]);

  document.title = `Dashboard | Event Manager`;

  useEffect(() => {
    const fetchIsLoggedIn = async () => {
      try {
        const setToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("Set-Token"))
          ?.split("=")[1];
        console.log("setToken", setToken);
        console.log("document.cookie", document.cookie);

        const headers = {
          // Include the 'Set-Token' cookie value in the request headers
          "Set-Token": setToken,
        };
        console.log("headers", headers);


        const response = await axios.get(
          "https://backend-gallery-walk-production.up.railway.app/isLoggedIn",
          {
            withCredentials: true, // Include credentials (e.g., session cookies)
            headers: headers,
          }
        );
        console.log(response.data); // Log the response
      } catch (error) {
        console.error("Error fetching isLoggedIn:", error); // Log any errors
      }
    };

    fetchIsLoggedIn();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/search`,
          {
            withCredentials: true,
            params: { query, page, pageSize },
          }
        );
        console.log("event", response.data.data);
        setEvents(response.data.data);
        setTotalEvents(response.data.totalEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, [page, pageSize, query]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/search`,
          {
            withCredentials: true,
            params: { query, page, pageSize },
          }
        );
        console.log("event fff", response.data);
        setEvents(response.data.data);
        setTotalEvents(response.data.totalEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchData();
  }, [page, pageSize, query]);

  const [thumbnails, setThumbnails] = useState<{ [key: number]: string }>({});
  const fetchProjectsData = async () => {
    try {
      await axios
        .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}projects/by-user`, {
          withCredentials: true,
          // params: { query, page, pageSize },
        })
        .then((response) => {
          console.log("project data", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const thumbnailData = await Promise.all(
          events.map(async (event: EventType) => {
            try {
              const thumbnail = await getThumbnail(event.id);
              return { eventId: event.id, thumbnail };
            } catch (thumbnailError) {
              // console.error(
              //   `Error fetching thumbnail for event ${event.id}:`,
              //   thumbnailError
              // );
              return { eventId: event.id, thumbnail: "" }; // Return an empty string or some default value in case of an error
            }
          })
        );

        const thumbnailMap: { [key: number]: string } = {};
        thumbnailData.forEach((data) => {
          thumbnailMap[data.eventId] = data.thumbnail;
        });

        // console.log("Thumbnail Map:", thumbnailMap);
        setThumbnails(thumbnailMap);
      } catch (error) {
        console.error("Error fetching thumbnails:", error);
      }
    };

    fetchThumbnails();

    fetchProjectsData();
  }, [events]);

  async function getThumbnail(event_id: number) {
    const thumbnail = await axios.get(
      `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/thumbnail/${event_id}`,
      {
        withCredentials: true,
      }
    );
    return thumbnail.data.data[0].thumbnail_url;
  }

  type EventType = {
    total_projects: number;
    location: string;
    id: number;
    event_name: string;
    start_date: string;
    end_date: string;
    virtual_money: number;
    unit_money: string;
    description: string;
    video_link: string;
  };

  const clipboard = useClipboard({ timeout: 500 });

  // thuumbnail container
  const defaultThumbnailUrl = `https://placehold.co/400?text=`;

  const card = events.map((event: EventType) => {
    const thumbnailUrl =
      thumbnails[event.id] ||
      `${defaultThumbnailUrl}${encodeURIComponent(event.event_name)}`;

    return (
      <Card
        key={event.id}
        className={styles.cardContainer}
        p="1rem"
        radius="md"
        mb="0.3rem"
      >
        <Grid columns={24} p={0}>
          <Grid.Col span="auto" p={0}>
            {thumbnailUrl && (
              <AspectRatio ratio={1} maw={200} p={0}>
                <img src={thumbnailUrl} style={{ borderRadius: "0.2rem" }} />
              </AspectRatio>
            )}
          </Grid.Col>
          <Grid.Col span={18} pl="1rem">
            <Text size="topic" c="redcolor.4" fw={500} truncate="end">
              {event.event_name}
            </Text>

            <Grid gutter="4rem" columns={12} my="xs">
              <Grid.Col span="content">
                <Text size="xsmall" mb="xs">
                  Start event
                </Text>
                <Text>{moment(event.start_date).format("LL [at] ")}</Text>
              </Grid.Col>

              <Grid.Col span="content">
                <Text size="xsmall" mb="xs">
                  End event
                </Text>
                <Text>{moment(event.end_date).format("LL [at] ")}</Text>
              </Grid.Col>

              <Grid.Col span={2}>
                <Text size="xsmall" mb="xs">
                  Location
                </Text>
                <Text truncate="end" maw="max-content">
                  {event.location || "-"}
                </Text>
              </Grid.Col>

              <Grid.Col span={2}>
                <Text size="xsmall" mb="xs">
                  Projects
                </Text>
                <Text>{event.total_projects || 0}</Text>
              </Grid.Col>
            </Grid>

            <Divider size="xs" color="graycolor.2" />

            <div style={{ marginTop: "1rem" }}>
              <Text size="xsmall" mb="xs">
                Description
              </Text>
              <Text lineClamp={2}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: event.description,
                  }}
                />
              </Text>
            </div>
          </Grid.Col>

          <Grid.Col span="content">
            <Stack h={180} align="flex-end" justify="space-between">
              <div>
                <ActionIcon.Group>
                  <ActionIcon variant="default" size="lg" aria-label="Gallery">
                    <IconQrcode size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="default"
                    size="lg"
                    aria-label="Settings"
                    onClick={() => clipboard.copy(event.id.toString())}
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

                <Flex align="center" mt="md">
                  <IconEye size={16} />
                  <Text ml="sm">0</Text>
                </Flex>
              </div>

              <Anchor href={`/event/${event.id}`} underline="never" ta="end">
                <Button
                  rightSection={<IconArrowNarrowRight size={14} />}
                  size="small"
                >
                  Event
                </Button>
              </Anchor>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>
    );
  });

  return (
    <body>
      {/* navbar */}
      <Navbar />

      <Grid w="80%" p="xl" mx="auto">
        <Grid.Col span={12}>
          <Text c="redcolor.4" fw={500} size="topic">
            Dashboard
          </Text>
          {/* <Select
                        size="small"
                        w="max-content"
                        rightSection={<IconChevronDown size={12} />}
                        data={["Event manager", "Presenter"]}
                        defaultValue="Event manager"
                        onSelect={(selectedTab: ChangeEvent<HTMLInputElement>) =>
                            handleTabChange(selectedTab)
                        }
                    /> */}

          <Flex align="center" gap="md" mt="sm">
            <Button
              variant="transparent"
              size="xs"
              color={
                activeTab === "Event manager" ? "redcolor.4" : "graycolor.2"
              }
              onClick={() => setActiveTab("Event manager")}
            >
              Event manager
            </Button>
            <Text>|</Text>
            <Button
              variant="transparent"
              size="xs"
              color={activeTab === "Presenter" ? "bluecolor.6" : "graycolor.2"}
              onClick={() => setActiveTab("Presenter")}
            >
              Presenter
            </Button>
          </Flex>
        </Grid.Col>

        <Grid.Col span={12}>
          {activeTab === "Event manager" && (
            <div>
              <Grid justify="space-between">
                <Grid.Col span={6}>
                  <TextInput
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search events"
                    rightSection={<IconSearch size={14} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Flex gap="lg" justify="end">
                    <a href="/create-event">
                      <Button
                        color="redcolor.4"
                        size="sm"
                        justify="center"
                        variant="filled"
                        rightSection={<IconSquarePlus size={14} />}
                      >
                        <Text c="pinkcolor.1">Create Event!</Text>
                      </Button>
                    </a>
                  </Flex>
                </Grid.Col>

                <Grid.Col span={12}>
                  {/* <Divider mb="lg" /> */}

                  <Text size="base" fw={500} c="dark.9" mt="1rem" mb="2rem">
                    Next Events
                  </Text>

                  <Container fluid p="0">
                    <SimpleGrid cols={{ base: 1, sm: 1 }} m="0">
                      {card}
                    </SimpleGrid>
                  </Container>

                  <Pagination.Root
                    mt="lg"
                    color="redcolor.4"
                    size="sm"
                    total={Math.ceil(totalEvents / pageSize)}
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

                  {/* <Pagination
                                        total={events.length}
                                        value={page}
                                        onChange={(newPage) => setPage(newPage)}
                                    /> */}
                </Grid.Col>
              </Grid>
            </div>
          )}
          {activeTab === "Presenter" && (
            <div>
              <div>
                <ProjectsDashboard />
              </div>
            </div>
          )}
        </Grid.Col>
      </Grid>
    </body>
  );
}
