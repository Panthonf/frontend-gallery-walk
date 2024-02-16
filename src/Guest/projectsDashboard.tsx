import {
  Button,
  Card,
  Center,
  Divider,
  Grid,
  Pagination,
  Text,
  TextInput,
  Anchor,
} from "@mantine/core";
import { IconSearch, IconArrowNarrowRight } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import styles from "../styles.module.css";

export default function ProjectsDashboard(props: {
  eventId: string | undefined;
}) {
  type ProjectType = {
    id: string;
    title: string;
    description: string;
    created_at: string;
  };

  const [projectsData, setProjectsData] = useState<ProjectType[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalProjects, setTotalProjects] = useState(0);

  useEffect(() => {
    const fetchProjectsData = async (eventId: string) => {
      try {
        console.log("eventId fff", eventId);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}projects/${eventId}/search`,
          {
            withCredentials: true,
            params: { query, page, pageSize },
          }
        );
        setTotalProjects(response.data.totalProjects);
        setProjectsData(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (props.eventId) {
      fetchProjectsData(props.eventId);
    }
  }, [page, props.eventId, query, pageSize]);

  return (
    <body>
      <Grid w="100%" p="xl">
        <Grid.Col span={12}>
          <Text c="redcolor.4" fw={500} size="topic" mt="md">
             Projects {projectsData.length > 0 ? `(${totalProjects})` : ""}
          </Text>
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            value={query}
            onChange={(project) => setQuery(project.target.value)}
            placeholder="Search events"
            rightSection={<IconSearch size={14} />}
          />
        </Grid.Col>

        <Grid.Col>
          {projectsData.length > 0 ? (
            <div>
              {projectsData.map((project: ProjectType) => (
                <Card className={styles.cardContainer} p="1rem" radius="md">
                  <Grid p={0}>
                    {/* <Grid.Col span="auto" p={0}>
                                            {thumbnailUrl && (
                                                <AspectRatio ratio={1} maw={200} p={0}>
                                                    <img src={thumbnailUrl} style={{ borderRadius: "0.2rem" }} />
                                                </AspectRatio>
                                            )}
                                        </Grid.Col> */}
                    <Grid.Col span={12} pl="1rem">
                      <Text size="topic" c="redcolor.4" fw={500} truncate="end">
                        {project.title}
                      </Text>

                      <Text>
                        {moment(project.created_at).format(
                          "MMMM Do YY HH:mm a"
                        )}
                      </Text>

                      <Divider size="xs" color="graycolor.2" />

                      <div style={{ marginTop: "1rem" }}>
                        <Text size="xsmall" mb="xs">
                          Description
                        </Text>
                        <Text lineClamp={2}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: project.description.toString() || "",
                            }}
                          ></div>
                        </Text>
                      </div>
                    </Grid.Col>

                    <Grid.Col span={12} ta="end">
                      <Anchor
                        href={`/guest/event/${props.eventId}/project/${project.id}`}
                        underline="never"
                        ta="end"
                      >
                        <Button
                          rightSection={<IconArrowNarrowRight size={14} />}
                          size="small"
                        >
                          View project
                        </Button>
                      </Anchor>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
            </div>
          ) : (
            <Text mt="md">No projects found</Text>
          )}

          <Center mt="md">
            <Pagination
              total={Math.ceil(totalProjects / pageSize)}
              boundaries={2}
              value={page}
              onChange={(newPage) => setPage(newPage)}
              color="redcolor.4"
            />
          </Center>
        </Grid.Col>
      </Grid>
    </body>
  );
}
