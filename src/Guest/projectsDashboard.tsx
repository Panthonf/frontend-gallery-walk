import {
  Card,
  Center,
  Divider,
  Grid,
  Pagination,
  Text,
  TextInput,
  Flex,
  UnstyledButton,
  Modal,
  Group,
  ActionIcon,
  Loader,
  Image,
  SimpleGrid,
  Anchor,
} from "@mantine/core";
import { IconSearch, IconCoin } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import styles from "../styles.module.css";
import { useDisclosure } from "@mantine/hooks";
import GuestProject from "./guestProject";
export default function ProjectsDashboard(props: {
  eventId: string | undefined;
}) {
  type ProjectType = {
    project_document: object;
    project_image: object;
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
  const [isProjectDataLoading, setIsProjectDataLoading] = useState(true);

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
        console.log("projects data", response.data);
        setTotalProjects(response.data.totalProjects);
        setProjectsData(response.data.data);
        setIsProjectDataLoading(false);
      } catch (err) {
        // console.error("Error fetching events:", error);
        setIsProjectDataLoading(false);
      }
    };

    if (props.eventId) {
      fetchProjectsData(props.eventId);
    }
  }, [page, props.eventId, query, pageSize]);

  const ModalProjectDetails = ({
    projectTitle,
    description,
    image,
    document,
  }: {
    projectTitle: string;
    description: string;
    image: object;
    document: object;
  }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        <Modal
          opened={opened}
          onClose={close}
          title="Project Details"
          //   centered
          w="fit-content"
        >
          <Text size="topic" c="greencolor.4" fw={500} truncate="end">
            {projectTitle}
          </Text>

          <div style={{ marginTop: "1rem" }}>
            <Text size="xsmall" mb="xs">
              Description
            </Text>
            <Text>
              <div
                dangerouslySetInnerHTML={{
                  __html: description.toString() || "",
                }}
              />
            </Text>
          </div>

          {Array.isArray(document) && document.length > 0 && (
            <>
              <Divider mt="md" size="xs" color="graycolor.2" />
              <Text size="xsmall" mb="xs" mt="md">
                Document
              </Text>
              <div>
                <SimpleGrid cols={2} spacing={1}>
                  {(
                    document as {
                      document_name: string;
                      document_url: string;
                    }[]
                  ).map(
                    (doc: { document_url: string; document_name: string }) => {
                      return (
                        <div>
                          {doc.document_name.includes(".pdf") ? (
                            <Anchor
                              ml="md"
                              href={"/pdf?pdf=" + doc.document_url}
                              ta="start"
                              target="_blank"
                              rel="noreferrer"
                              underline="always"
                              c={"bluecolor.4"}
                            >
                              {doc.document_name}
                            </Anchor>
                          ) : (
                            <Anchor
                              ml="md"
                              href={doc.document_url}
                              ta="start"
                              target="_blank"
                              rel="noreferrer"
                              underline="always"
                              c={"bluecolor.4"}
                            >
                              {doc.document_name}
                            </Anchor>
                          )}
                        </div>
                      );
                    }
                  )}
                </SimpleGrid>
              </div>
            </>
          )}

          {Array.isArray(image) && image.length > 0 && (
            <>
              <Divider mt="md" size="xs" color="graycolor.2" />
              <div>
                <SimpleGrid cols={1}>
                  {(image as { project_image_url: string }[]).map(
                    (img: { project_image_url: string }) => {
                      return (
                        <div>
                          <Image
                            mt="md"
                            src={img.project_image_url}
                            alt="project image"
                            w={300}
                            h={300}
                          />
                        </div>
                      );
                    }
                  )}
                </SimpleGrid>
              </div>
            </>
          )}
        </Modal>

        <Flex align="center" gap="md">
          <Text size="topic" c="greencolor.4" fw={500} truncate="end">
            {projectTitle}
          </Text>

          <UnstyledButton c="graycolor.2" onClick={open}>
            <Text c="graycolor.2" size="small">
              Details
            </Text>
          </UnstyledButton>
        </Flex>
      </>
    );
  };

  const ModalGiveVirtualMoney = ({ projectId }: { projectId: number }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <div>
        <Modal opened={opened} onClose={close} title="Give Virtual Money">
          <GuestProject projectId={projectId} />
        </Modal>
        <ActionIcon
          variant="filled"
          color="greencolor.4"
          aria-label="Settings"
          onClick={open}
        >
          <IconCoin />
        </ActionIcon>
      </div>
    );
  };

  return (
    <body>
      <div>
        <Grid w="100%">
          <Grid.Col span={12}>
            <Text c="greencolor.4" fw={500} size="topic" mt="md">
              Projects {projectsData.length > 0 ? `(${totalProjects})` : ""}
            </Text>
          </Grid.Col>
          <Grid.Col span={12} mb="md">
            <TextInput
              value={query}
              onChange={(project) => setQuery(project.target.value)}
              placeholder="Search events"
              rightSection={<IconSearch size={14} />}
            />
          </Grid.Col>
          <Grid.Col>
            <>
              {isProjectDataLoading ? (
                <Center>
                  <Loader type="dots" my="md" color="greencolor.4" size={40} />
                </Center>
              ) : (
                <>
                  {projectsData.length > 0 ? (
                    <div>
                      {projectsData.map((project: ProjectType) => (
                        <Card
                          className={styles.cardContainer}
                          p="1rem"
                          radius="md"
                          mb="0.3rem"
                        >
                          <Grid p={0} style={{ position: "relative" }}>
                            {/* <Grid.Col span="auto" p={0}>
                                                {thumbnailUrl && (
                                                    <AspectRatio ratio={1} maw={200} p={0}>
                                                        <img src={thumbnailUrl} style={{ borderRadius: "0.2rem" }} />
                                                    </AspectRatio>
                                                )}
                                            </Grid.Col> */}
                            <Grid.Col pl="1rem">
                              <ModalProjectDetails
                                projectTitle={project.title as string}
                                description={project.description as string}
                                image={project.project_image as object}
                                document={project.project_document as object}
                              />

                              <Text my="xs" c="graycolor.2" size="small">
                                {moment(project.created_at).format(
                                  "MMMM Do YY HH:mm A"
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
                                      __html:
                                        project.description.toString() || "",
                                    }}
                                  />
                                </Text>
                              </div>
                            </Grid.Col>
                            <div
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                              }}
                            >
                              <ModalGiveVirtualMoney
                                projectId={Number(project.id)}
                              />
                            </div>
                          </Grid>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Center>
                      <Text size="lg" c="graycolor.2">
                        No projects found
                      </Text>
                    </Center>
                  )}
                </>
              )}
            </>

            <Center mt="md">
              <Pagination.Root
                color="greencolor.4"
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
          </Grid.Col>
        </Grid>
        {/* footer */}
        {/* <Affix mt="2rem" className={`${styles.footer} ${styles.guest}`}></Affix> */}
      </div>
    </body>
  );
}
