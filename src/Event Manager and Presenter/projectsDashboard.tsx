import {
  Card,
  Divider,
  TextInput,
  Text,
  Pagination,
  Group,
  Button,
  Grid,
  Container,
  SimpleGrid,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import axios from "axios";
// import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import parse from "html-react-parser";

import styles from "../styles.module.css";

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
  submit_start: string;
  submit_end: string;
};

export default function ProjectsDashboard() {
  const [total, setTotal] = useState(0);
  const [projects, setProjects] = useState<ProjectType | null>();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, ] = useState(5);

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
      <Grid justify="space-between">
        <Grid.Col span={6}>
          <TextInput
            leftSection={<IconSearch size={14} />}
            placeholder="Search project"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {/* <Select
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
                        /> */}
        </Grid.Col>
        {/* <Grid.Col span={6}>
                    <Flex gap="lg" justify="end">
                        <a href="/create-event">
                            <Button
                                color="redcolor.4"
                                size="sm"
                                justify="center"
                                variant="filled"
                                rightSection={<IconSquarePlus size={14} />}
                            >
                                <Text c="pinkcolor.1">Add project</Text>
                            </Button>
                        </a>
                    </Flex>
                </Grid.Col> */}

        <Grid.Col span={12}>
          {/* <Divider mb="lg" /> */}

          <Text size="base" fw={500} c="dark.9" my="1rem">
            Projects
          </Text>

          <Container fluid p="0">
            <SimpleGrid cols={{ base: 1, sm: 1 }}>
              {projects && projects.length > 0 ? (
                projects.map((projects: ProjectType) => (
                  <Card
                    key={projects.id}
                    className={styles.cardContainer}
                    p="1rem"
                    radius="md"
                  >
                    <Grid columns={24} p={0}>
                      <Grid.Col span={24} pl="1rem">
                        <Text
                          size="topic"
                          c="redcolor.4"
                          fw={500}
                          truncate="end"
                        >
                          {projects?.title}
                        </Text>

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
                      <Button
                        variant="outline"
                        color="redcolor.4"
                        mt="md"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          window.location.href = `/project/${projects.id}`;
                        }}
                      >
                        View
                      </Button>
                    </Grid>
                  </Card>

                  // <Card padding="lg" key={project.id} shadow="sm" radius="sm" mt="md">
                  //     <Flex justify="space-between">
                  //         <Title>
                  //             <Highlight highlight={query}>{project.title}</Highlight>
                  //         </Title>
                  //         <Badge color="redcolor.4" variant="light" p="sm">
                  //             <Anchor
                  //                 href={`/event/${project.event_id}`}
                  //                 style={{ color: "inherit" }}
                  //                 fw={700}
                  //             >
                  //                 Go to event
                  //             </Anchor>
                  //         </Badge>
                  //     </Flex>
                  //     <Divider mb="lg" mt="lg" />
                  //     <Text lineClamp={2}>
                  //         {project.description
                  //             ? parse(project.description)
                  //             : "No description"}
                  //     </Text>
                  //     <Text mt="md" size="xs" c="gray">
                  //         Created at:{" "}
                  //         {moment(project.created_at).format("DD/MM/yyyy HH:mm:ss")}
                  //     </Text>
                  //     <Button
                  //         variant="outline"
                  //         color="redcolor.4"
                  //         mt="md"
                  //         size="sm"
                  //         fullWidth
                  //         onClick={() => {
                  //             window.location.href = `/project/${project.id}`;
                  //         }}
                  //     >
                  //         View
                  //     </Button>
                  // </Card>
                ))
              ) : (
                <Text>No projects found</Text>
              )}

              {/* <Card
                                key={projects.id}
                                className={styles.cardContainer}
                                p="1rem"
                                radius="md"
                            >
                                <Grid columns={24} p={0}>

                                    <Grid.Col span={18} pl="1rem">
                                        <Text size="topic" c="redcolor.4" fw={500} truncate="end">
                                            {projects?.title}
                                        </Text>

                                        <Grid gutter="4rem" columns={12} my="xs">
                                            <Grid.Col span="content">
                                                <Text size="xsmall" mb="xs">
                                                    Start event
                                                </Text>
                                                <Text>
                                                    {moment(event.start_date).format("MMMM Do YYYY, HH:mm A")}
                                                </Text>
                                            </Grid.Col>

                                            <Grid.Col span="content">
                                                <Text size="xsmall" mb="xs">
                                                    End event
                                                </Text>
                                                <Text>
                                                    {moment(event.end_date).format("MMMM Do YYYY, HH:mm A")}
                                                </Text>
                                            </Grid.Col>

                                            <Grid.Col span={2}>
                                                <Text size="xsmall" mb="xs">
                                                    Location
                                                </Text>
                                                <Text truncate="end" maw="max-content">
                                                    30th Building
                                                </Text>
                                            </Grid.Col>

                                            <Grid.Col span={2}>
                                                <Text size="xsmall" mb="xs">
                                                    Projects
                                                </Text>
                                                <Text>12</Text>
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
                                </Grid>
                            </Card> */}
            </SimpleGrid>
          </Container>

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
        </Grid.Col>
      </Grid>
    </div>
    // <div>
    //     <Title mb="md" order={3}>
    //         Projects
    //     </Title>
    //     <Flex align="center" justify="flex-start">
    //         <TextInput
    //             leftSection={<IconSearch size={14} />}
    //             placeholder="Search project"
    //             value={query}
    //             onChange={(event) => setQuery(event.target.value)}
    //         />
    //         <Select
    //             ml="lg"
    //             searchable
    //             w="80"
    //             placeholder={pageSize.toString()}
    //             data={["5", "10", "15", "20"]}
    //             defaultValue="5"
    //             onChange={(value) => {
    //                 setPageSize(value === null ? 5 : Number(value));
    //                 setPage(1);
    //             }}
    //             onSearchChange={(value) => {
    //                 setPageSize(value === null ? 5 : Number(value));
    //                 setPage(1);
    //             }}
    //         />
    //     </Flex>

    //     <Divider mb="lg" mt="lg" />

    //     {projects && projects.length > 0 ? (
    //         projects.map((project: ProjectType) => (
    //             <Card padding="lg" key={project.id} shadow="sm" radius="sm" mt="md">
    //                 <Flex justify="space-between">
    //                     <Title>
    //                         <Highlight highlight={query}>{project.title}</Highlight>
    //                     </Title>
    //                     <Badge color="redcolor.4" variant="light" p="sm">
    //                         <Anchor
    //                             href={`/event/${project.event_id}`}
    //                             style={{ color: "inherit" }}
    //                             fw={700}
    //                         >
    //                             Go to event
    //                         </Anchor>
    //                     </Badge>
    //                 </Flex>
    //                 <Divider mb="lg" mt="lg" />
    //                 <Text lineClamp={2}>
    //                     {project.description
    //                         ? parse(project.description)
    //                         : "No description"}
    //                 </Text>
    //                 <Text mt="md" size="xs" c="gray">
    //                     Created at:{" "}
    //                     {moment(project.created_at).format("DD/MM/yyyy HH:mm:ss")}
    //                 </Text>
    //                 <Button
    //                     variant="outline"
    //                     color="redcolor.4"
    //                     mt="md"
    //                     size="sm"
    //                     fullWidth
    //                     onClick={() => {
    //                         window.location.href = `/project/${project.id}`;
    //                     }}
    //                 >
    //                     View
    //                 </Button>
    //             </Card>
    //         ))
    //     ) : (
    //         <Text>No projects found</Text>
    //     )}

    //     <Pagination.Root
    //         mt="lg"
    //         color="redcolor.4"
    //         size="sm"
    //         total={Math.ceil(total / pageSize)}
    //         value={page}
    //         onChange={(newPage) => setPage(newPage)}
    //     >
    //         <Group gap={5} justify="center">
    //             <Pagination.First />
    //             <Pagination.Previous />
    //             <Pagination.Items />
    //             <Pagination.Next />
    //             <Pagination.Last />
    //         </Group>
    //     </Pagination.Root>
    //     <Divider mb="lg" mt="lg" />
    // </div>
  );
}
