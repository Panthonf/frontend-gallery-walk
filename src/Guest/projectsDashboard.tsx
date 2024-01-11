import {
  Button,
  Card,
  Center,
  Flex,
  Highlight,
  Pagination,
  Select,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

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
  const [pageSize, setPageSize] = useState(5);
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
    <div>
      <Card
        style={{ margin: "auto", width: "70%" }}
        mt="lg"
        shadow="sm"
        // mb="lg"
      >
        <Text>
          <Flex
            mt="sm"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
            gap="md"
          >
            <TextInput
              w={600}
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
          </Flex>
          <Text size="md" my="md" fw={500}>
            {totalProjects} Projects
          </Text>
          {projectsData.length > 0 ? (
            <div>
              {projectsData.map((project: ProjectType) => (
                <Card mt="sm" key={project.id}>
                  <Text size="lg" fw={700}>
                    <Highlight highlight={query}>{project.title}</Highlight>
                  </Text>
                  <Text mt="md" truncate>
                    <Highlight highlight={query}>
                      {project.description}
                    </Highlight>
                  </Text>
                  <Text size="md" c="gray" mt="sm">
                    {moment(project.created_at).format("MMMM Do YY HH:mm a")}
                  </Text>
                  <Button
                    variant="outline"
                    color="blue"
                    size="sm"
                    mt="sm"
                    component="a"
                    href={`/guest/event/${props.eventId}/project/${project.id}`}
                  >
                    View Project
                  </Button>
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
            />
          </Center>
        </Text>
      </Card>
    </div>
  );
}
