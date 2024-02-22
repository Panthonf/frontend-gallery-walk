import {
  Card,
  Divider,
  TextInput,
  Text,
  Button,
  // Anchor,
  Grid,
  Container,
  SimpleGrid,
  Stack,
  Flex,
  Modal,
  Box,
  Group,
  Anchor,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconArrowNarrowRight,
  IconArrowsJoin,
  IconSearch,
} from "@tabler/icons-react";
import axios from "axios";
import { ReactNode, SetStateAction, useEffect, useState } from "react";
import parse from "html-react-parser";

import styles from "../styles.module.css";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";
import { Pagination } from "@mantine/core";

type ProjectType = {
  event_data: object;
  virtual_money: ReactNode;
  event_id: ReactNode;
  event_name: string;
  length: number;
  map(
    arg0: (project: ProjectType) => import("react/jsx-runtime").JSX.Element
  ): ReactNode;
  id: number;
  title: string;
  created_at: string;
  description: string;
  submit_start: string;
  submit_end: string;
};

export default function ProjectsDashboard() {
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<ProjectType | null>();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [pageSize] = useState(5);
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      await axios
        .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}projects/by-user`, {
          withCredentials: true,
          params: { query, page, pageSize },
        })
        .then((res) => {
          console.log("projects", res.data);
          setProjects(res.data.data);
          setTotal(res.data.totalProjects);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchProjects();
  }, [query, page, pageSize]);

  const [eventLink, setEventLink] = useState("");

  const handleJoinEvent = () => {
    if (eventLink) {
      window.location.href = eventLink;
    }
  };

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setEventLink(e.target.value);
  };

  return (
    <div>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search project"
            rightSection={<IconSearch size={14} />}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Flex gap="lg" justify="end">
            <Button
              color="bluecolor.6"
              justify="center"
              variant="filled"
              rightSection={<IconArrowsJoin size={14} />}
              onClick={open}
            >
              Join event
            </Button>

            <Modal
              opened={opened}
              onClose={close}
              title="Add project by link to event"
              centered
            >
              <Box ta="end">
                <TextInput
                  placeholder="Event link"
                  mb="md"
                  value={eventLink}
                  onChange={handleInputChange}
                />
                <Button
                  color="bluecolor.6"
                  size="sm"
                  justify="end"
                  variant="filled"
                  type="button"
                  onClick={handleJoinEvent}
                >
                  <Text c="pinkcolor.2">Join event</Text>
                </Button>
              </Box>
            </Modal>
          </Flex>
        </Grid.Col>

        <Grid.Col span={12}>
          <Text size="base" fw={500} c="dark.9" mt="1rem" mb="2rem">
            Projects {total > 0 && `(${total})`}
          </Text>

          {isLoading ? (
            <Center my="md">{isLoading && <Loader />}</Center>
          ) : (
            <>
              {projects && projects.length > 0 ? (
                projects.map((projects: ProjectType) => (
                  <Container fluid p="0">
                    <SimpleGrid cols={{ base: 1, sm: 1 }}>
                      <Card
                        key={projects.id}
                        className={styles.cardContainer}
                        p="1rem"
                        radius="md"
                        mb="lg"
                      >
                        <Grid p={0}>
                          <Grid.Col span={10.5} pl="1rem">
                            <Text
                              size="topic"
                              c="bluecolor.6"
                              fw={500}
                              truncate="end"
                            >
                              {projects?.title}
                            </Text>
                            <Grid gutter="4rem" my="xs">
                              <Grid.Col span="auto">
                                <Text size="xsmall" mb="xs">
                                  Event name
                                </Text>
                                <Text truncate="end" maw="max-content">
                                  {(
                                    projects.event_data as {
                                      event_name: string;
                                    }
                                  )?.event_name ? (
                                    <>
                                      {
                                        (
                                          projects.event_data as {
                                            event_name: string;
                                          }
                                        )?.event_name
                                      }
                                      <Anchor
                                        href={`/event/${projects.event_id}`}
                                        style={{ color: "inherit" }}
                                        fw={700}
                                        ml="md"
                                        size="xsmall"
                                        underline="hover"
                                      >
                                        <IconArrowNarrowRight size={14} />
                                        {/* {(projects.event_data as { event_name: string })?.event_name} */}
                                      </Anchor>
                                    </>
                                  ) : (
                                    "Event was deleted"
                                  )}
                                </Text>
                              </Grid.Col>
                              <Grid.Col span="auto">
                                <Text size="xsmall" mb="xs">
                                  Virtual money
                                </Text>
                                <Text truncate="end" maw="max-content">
                                  {moment().isBetween(
                                    (
                                      projects.event_data as {
                                        start_date: string;
                                        end_date: string;
                                      }
                                    )?.start_date,
                                    (
                                      projects.event_data as {
                                        start_date: string;
                                        end_date: string;
                                      }
                                    )?.end_date
                                  ) ? (
                                    <Text c="redcolor.4" size="xsmall">
                                      Will be available after event ends
                                    </Text>
                                  ) : (
                                    projects.virtual_money
                                  )}
                                </Text>
                              </Grid.Col>
                              <Grid.Col span="auto">
                                <Text size="xsmall" mb="xs">
                                  Location
                                </Text>
                                <Text truncate="end" maw="max-content">
                                  {(projects.event_data as { location: string })
                                    ?.location
                                    ? (
                                        projects.event_data as {
                                          location: string;
                                        }
                                      )?.location
                                    : "-"}
                                </Text>
                              </Grid.Col>
                              <Grid.Col span="auto">
                                <Text size="xsmall" mb="xs">
                                  Status
                                </Text>
                                <Text truncate="end" maw="max-content">
                                  {moment().isBetween(
                                    (
                                      projects.event_data as {
                                        start_date: string;
                                        end_date: string;
                                      }
                                    )?.start_date,
                                    (
                                      projects.event_data as {
                                        start_date: string;
                                        end_date: string;
                                      }
                                    )?.end_date
                                  )
                                    ? "Event ongoing"
                                    : "Event ended"}
                                </Text>
                              </Grid.Col>
                            </Grid>
                            <Divider size="xs" color="graycolor.2" />
                            <div style={{ marginTop: "1rem" }}>
                              <Text size="xsmall" mb="xs">
                                Description
                              </Text>
                              <Text lineClamp={2}>
                                {projects.description
                                  ? parse(projects.description)
                                  : "No description"}
                              </Text>
                            </div>
                          </Grid.Col>
                          <Grid.Col span={1.5}>
                            <Stack
                              h={180}
                              align="flex-end"
                              justify="space-between"
                            >
                              <div>
                                <Text size="small" c="graycolor.2">
                                  Created at:
                                </Text>
                                <Text size="small" c="graycolor.2">
                                  {moment(projects.created_at).format(
                                    "LL [at] HH:mm"
                                  )}
                                </Text>
                              </div>
                              <Button
                                rightSection={
                                  <IconArrowNarrowRight size={14} />
                                }
                                size="small"
                                onClick={() => {
                                  window.location.href = `/project/${projects.id}`;
                                }}
                                color="bluecolor.6"
                              >
                                Project
                              </Button>
                            </Stack>
                          </Grid.Col>
                        </Grid>
                      </Card>
                    </SimpleGrid>
                  </Container>
                ))
              ) : (
                <Text>No projects found</Text>
              )}
              <Flex justify="center">
                <Pagination.Root
                  color="bluecolor.6"
                  size="sm"
                  total={Math.ceil(total / pageSize)}
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
              </Flex>
            </>
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
}
