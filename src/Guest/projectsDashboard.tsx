import {
  Card,
  Center,
  Divider,
  Grid,
  Pagination,
  Text,
  TextInput,
  Flex,
  Modal,
  Group,
  ActionIcon,
  Loader,
  Image,
  SimpleGrid,
  Anchor,
  Select,
} from "@mantine/core";
import { IconSearch, IconCoin, IconMessagePlus } from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import styles from "../styles.module.css";
import { useDisclosure } from "@mantine/hooks";
import GuestProject from "./guestProject";
import Comment from "./comment";
export default function ProjectsDashboard(props: {
  eventId: string | undefined;
  handleModalClose: () => void; // Define a prop to handle modal close event
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
  const [pageSize, setPageSize] = useState(30);
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
            // params: { query, page, pageSize },
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setPage(1); // Reset page to 1 when search term changes
  };

  const filteredData = (projectsData as unknown as ProjectType[])?.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  const paginatedData = (filteredData || []).slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const ModalProjectDetails = ({
    projectTitle,
    description,
    image,
    document,
    createAt,
  }: {
    projectTitle: string;
    image: object;
    document: object;
    createAt: string;
    description: string;
  }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <div>
        <Modal
          opened={opened}
          onClose={close}
          title="Project Details"
          style={{ width: "fit-content" }}
          h={500}
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
                {(
                  document as {
                    document_name: string;
                    document_url: string;
                  }[]
                ).map(
                  (doc: { document_url: string; document_name: string }) => {
                    return (
                      <ul>
                        <li>
                          <Anchor
                            mt="md"
                            href={doc.document_url}
                            ta="start"
                            target="_blank"
                            rel="noreferrer"
                            underline="always"
                            c={"bluecolor.4"}
                          >
                            {doc.document_name.split("-").pop()}
                          </Anchor>
                        </li>
                      </ul>
                    );
                  }
                )}
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
                        <Anchor
                          href={"/image?image=" + img.project_image_url}
                          target="_blank"
                        >
                          <Image
                            mt="md"
                            src={img.project_image_url}
                            alt="project image"
                            w={300}
                            h={300}
                          />
                        </Anchor>
                      );
                    }
                  )}
                </SimpleGrid>
              </div>
            </>
          )}
        </Modal>

        <Flex align="center" gap="md">
          {/* <Text
            size="topic"
            onClick={open}
            c="greencolor.4"
            fw={500}
            truncate="end"
            style={{
              cursor: "pointer",
            }}
          >
            {projectTitle}
          </Text> */}

          <Anchor
            size="topic"
            onClick={open}
            underline="hover"
            c="greencolor.4"
          >
            {projectTitle}
          </Anchor>

          {/* <UnstyledButton c="graycolor.2" >
            <Text c="graycolor.2" size="small">
              Details
            </Text>
          </UnstyledButton> */}
        </Flex>
        <Text my="xs" c="graycolor.2" size="small">
          {moment(createAt).format("MMMM Do YY HH:mm A")}
        </Text>
        <Divider size="xs" color="graycolor.2" />
        <div style={{ marginTop: "1rem" }}>
          <Text size="xsmall" mb="xs">
            Description
          </Text>
          <Text lineClamp={2}>
            <Anchor onClick={open}>
              <div
                dangerouslySetInnerHTML={{
                  __html: description.toString() || "",
                }}
              />
            </Anchor>
          </Text>
        </div>
      </div>
    );
  };

  const ModalGiveVirtualMoney = ({ projectId }: { projectId: number }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const handleModalClose = () => {
      close();
      props.handleModalClose(); // Call the function passed from props
    };

    return (
      <div>
        <Modal
          opened={opened}
          onClose={handleModalClose}
          title="Give Virtual Money"
        >
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

  const ModalGiveComment = ({ projectId }: { projectId: number }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <div>
        <Modal opened={opened} onClose={close} title="Give Comment">
          <Comment projectId={projectId} />
        </Modal>
        <ActionIcon
          variant="filled"
          color="greencolor.4"
          aria-label="Settings"
          onClick={open}
        >
          <IconMessagePlus />
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
              Projects {projectsData?.length > 0 ? `(${totalProjects})` : ""}
            </Text>
          </Grid.Col>
          <Grid.Col span={12} mb="md">
            <Flex align="center" justify="flex-start" gap="md">
              <TextInput
                value={query}
                onChange={handleSearchChange}
                placeholder="Search events"
                rightSection={<IconSearch size={14} />}
                w={300}
              />

              <Select
                data={["5", "10", "15", "30"]}
                defaultValue={"30"}
                onChange={(value) => {
                  setPageSize(Number(value));
                }}
                // label="Items per page"
                w={50}
              />
            </Flex>
          </Grid.Col>
          <Grid.Col>
            <>
              {isProjectDataLoading ? (
                <Center>
                  <Loader type="dots" my="md" color="greencolor.4" size={40} />
                </Center>
              ) : (
                <>
                  {paginatedData?.length > 0 ? (
                    <div>
                      {paginatedData.map((project: ProjectType) => (
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
                                createAt={project.created_at}
                              />
                            </Grid.Col>
                            <div
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                              }}
                            >
                              <ModalGiveComment
                                projectId={Number(project.id)}
                              />
                            </div>
                            <div
                              style={{
                                position: "absolute",
                                right: "2rem",
                                top: "0",
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
                total={Math.ceil(filteredData.length / pageSize)}
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
