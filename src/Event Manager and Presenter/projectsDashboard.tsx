import {
  Card,
  Divider,
  TextInput,
  Title,
  Text,
  Pagination,
  Group,
  Select,
  Flex,
  Highlight,
  Button,
  Badge,
  Anchor,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import parse from "html-react-parser";

export default function ProjectsDashboard() {
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<ProjectType | null>();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchProjects = async () => {
      await axios
        .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}projects/by-user`, {
          withCredentials: true,
          params: { query, page, pageSize },
        })
        .then((res) => {
          console.log("gg", res.data);
          setProjects(res.data.data);
          setTotal(res.data.totalProjects);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchProjects();
  }, [query, page, pageSize]);

  return (
    <div>
      <Title mb="md" order={3}>
        Projects
      </Title>
      <Flex align="center" justify="flex-start">
        <TextInput
          leftSection={<IconSearch size={14} />}
          placeholder="Search project"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          ml="lg"
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

      <Divider mb="lg" mt="lg" />

      {projects && projects.length > 0 ? (
        projects.map((project: ProjectType) => (
          <Card padding="lg" key={project.id} shadow="sm" radius="sm" mt="md">
            <Flex justify="space-between">
              <Title>
                <Highlight highlight={query}>{project.title}</Highlight>
              </Title>
              <Badge color="redcolor.4" variant="light" p="sm">
                <Anchor
                  href={`/event/${project.event_id}`}
                  style={{ color: "inherit" }}
                  fw={700}
                >
                  Go to event
                </Anchor>
              </Badge>
            </Flex>
            <Divider mb="lg" mt="lg" />
            <Text lineClamp={2}>
              {project.description
                ? parse(project.description)
                : "No description"}
            </Text>
            <Text mt="md" size="xs" c="gray">
              Created at:{" "}
              {moment(project.created_at).format("DD/MM/yyyy HH:mm:ss")}
            </Text>
            <Button
              variant="outline"
              color="redcolor.4"
              mt="md"
              size="sm"
              fullWidth
              onClick={() => {
                window.location.href = `/project/${project.id}`;
              }}
            >
              View
            </Button>
          </Card>
        ))
      ) : (
        <Text>No projects found</Text>
      )}

      <Pagination.Root
        mt="lg"
        color="redcolor.4"
        size="sm"
        total={Math.ceil(total / pageSize)}
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

      <Divider mb="lg" mt="lg" />
    </div>
  );
}

type ProjectType = {
  event_id: ReactNode;
  length: number;
  map(
    arg0: (project: ProjectType) => import("react/jsx-runtime").JSX.Element
  ): ReactNode;
  id: number;
  title: string;
  created_at: string;
  description: string;
};
