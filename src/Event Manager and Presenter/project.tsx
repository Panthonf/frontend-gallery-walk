import {
  Card,
  // Title,
  Text,
  Flex,
  // Divider,
  Button,
  TextInput,
  Grid,
  ActionIcon,
  // Anchor,
  Stack,
  Modal,
  Box,
  Group,
  Affix,
  SimpleGrid,
  Paper,
  GridCol,
  Center,
  // Container,
  // rem,
  Image,
  Anchor,
  FileInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
// import { useForm } from "@mantine/form";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import {
  IconArrowLeft,
  IconArrowNarrowRight,
  IconArrowsDiagonal,
  IconCoins,
  IconEdit,
  IconFile,
  IconLayoutGridAdd,
  IconPhotoUp,
  IconQrcode,
  IconTrash,
  IconUserQuestion,
} from "@tabler/icons-react";
import Navbar from "../components/navbar";

import styles from "../styles.module.css";
import { useDisclosure } from "@mantine/hooks";

import { generateRandomName } from "../components/generate_name";
// import { colors } from "unique-names-generator";
import QRCode from "qrcode";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";

type ProjectType = {
  project_image: {
    project_id: number;
    project_image: string;
    id: number;
    project_image_url: string;
  }[];
  id: string;
  title: string;
  description: string;
  created_at: string;
  event_id: string;
  start_submit: string;
  end_submit: string;
  project_document: {
    project_id: number;
    document_url: string | undefined;
    document_name: string;
    project_document: string;
  }[];
};

type EventType = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  event_id: string;
  end_date: string;
  unit_money: string;
  submit_start: string;
  submit_end: string;
};

type CommentType = {
  id: string;
  comment: string;
  created_at: string;
  anonymousName?: string;
};

export default function Projects() {
  const projectId = useParams<{ projectId: string }>().projectId;
  const [project, setProject] = useState<ProjectType | null>();
  const [event, setEvent] = useState<EventType>();
  const [virtualMoney, setVirtualMoney] = useState<number>(0);
  const [comment, setComment] = useState<CommentType | null>();
  const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);

  document.title = project?.title || "Project";

  const fetchProject = async () => {
    try {
      await axios
        .get(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }projects/get-data/${projectId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setProject(res.data.data);
          if (res.data.data == null) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Project not found!",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/dashboard";
              }
            });
          }
        });
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }projects/get-data/${projectId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log("project data ff", res.data.data);
            setProject(res.data.data);
            if (res.data.data == null) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Project not found!",
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = "/dashboard";
                }
              });
            }
          });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();

    const fetchEvent = async () => {
      console.log("event id", project?.event_id);

      try {
        await axios
          .get(
            `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${
              project?.event_id
            }`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log("event data", res.data.data);
            setEvent(res.data.data);
          });
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();

    const fetchProjectVirtualMoney = async () => {
      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }projects/get-virtual-money/${projectId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            setVirtualMoney(res.data.data);
            console.log("project virtual money", res.data.data);
          });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProjectVirtualMoney();

    const fetchProjectComment = async () => {
      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }projects/get-comments/${projectId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log("project comments", res.data.data);
            const commentsWithAnonymousNames = res.data.data.map(
              (comment: CommentType) => ({
                ...comment,
                anonymousName: generateRandomName(comment.id),
              })
            );

            setComment(commentsWithAnonymousNames);
          });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    const generateQRCode = async () => {
      try {
        const url = `${import.meta.env.VITE_FRONTEND_ENDPOINT}/guest/event/${
          project?.event_id
        }/project/${projectId}`;
        const dataUrl = await QRCode.toDataURL(url);
        setQRCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    generateQRCode();
    fetchProjectComment();
  }, [project?.event_id, projectId]);

  const StateVirtualMoney = () => {
    return (
      <>
        {moment(event?.end_date).isBefore(moment()) ? (
          <Text fw={500} c="bluecolor.4">
            {virtualMoney} {event?.unit_money}
          </Text>
        ) : (
          <>
            <Grid align="center" gutter="md">
              <Grid.Col span="content">
                <Text c="graycolor.2" size="small">
                  Available on{" "}
                  {moment(event?.end_date).format("L [at] HH:mm A")}{" "}
                </Text>
              </Grid.Col>

              <Grid.Col span="auto">
                <Text c="bluecolor.4" fw={500}>
                  {moment(event?.end_date).endOf("hour").fromNow()}
                </Text>
              </Grid.Col>
            </Grid>
          </>
        )}
      </>
    );
  };

  const icons = {
    projects: IconLayoutGridAdd,
    guests: IconUserQuestion,
    money: IconCoins,
  };

  const data = [
    // {
    //     title: "Projects",
    //     icon: "projects",
    //     value: "10",
    //     label: "Project from event presenter",
    // },
    // {
    //   title: "Guests",
    //   icon: "guests",
    //   value: "1234",
    //   label: "Number of guests",
    // },
    {
      title: "Virtual money",
      icon: "money",
      value: StateVirtualMoney(),
      label: "Number of virtual money",
    },
  ];

  const uploadProjectDocument = async (projectId: number) => {
    const formData = new FormData();
    documents.forEach((file) => {
      formData.append("file", file);
    });
    try {
      await axios
        .post(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }projects/upload-documents/${projectId}`,
          formData,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("upload project document", res.data);
          Swal.fire({
            title: "Success",
            text: "Updated project description and images",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            setDocuments([]);
            fetchProject();
          });
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

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
        style={{ border: "0.05rem solid var(--bluecolor)" }}
      >
        <Group justify="space-between">
          <Text>{stat.title}</Text>
          <Icon size={16} color="var(--bluecolor)" />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text fw={500} c="bluecolor.4">
            {stat.value}
          </Text>
        </Group>

        <Text fz="xs" c="graycolor.2" mt={7}>
          {stat.label}
        </Text>
      </Paper>
    );
  });

  const ModalEdit = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [editedTitle, setEditedTitle] = useState(project?.title || "");

    const handleEdit = () => {
      open();
      setEditedTitle(project?.title || "");
    };

    const updateProjectTitle = async (values: object) => {
      try {
        await axios
          .put(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }projects/update-title/${projectId}`,
            {
              title: (values as { title: string }).title,
            },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            setProject(res.data.data);
            console.log("update project title", res.data.data);

            Swal.fire({
              title: "Success",
              text: "Updated project title",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              window.location.reload();
            });
          });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    return (
      <>
        <Flex align="center" gap="md">
          <Text c="bluecolor.4" fw={600} size="topic">
            {project?.title}{" "}
          </Text>

          <ActionIcon
            variant="transparent"
            onClick={handleEdit}
            size="xs"
            color="bluecolor.4"
          >
            <IconEdit size={14} stroke={1.5} onClick={open} />
          </ActionIcon>
        </Flex>

        <Modal opened={opened} onClose={close} title="Edit Project Title">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProjectTitle({ title: editedTitle });
            }}
          >
            <TextInput
              label="Title"
              placeholder="Project title"
              required
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />

            <Flex justify="flex-end" mt="md" gap="md">
              <Button variant="outline" size="xs" onClick={close}>
                Cancel
              </Button>

              <Button variant="filled" size="xs" type="submit" onClick={close}>
                Save
              </Button>
            </Flex>
          </form>
        </Modal>
      </>
    );
  };

  const QrCodeModal = () => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
      <>
        <ActionIcon
          onClick={open}
          variant="default"
          size="lg"
          aria-label="Gallery"
        >
          <IconQrcode size={16} />
        </ActionIcon>
        <Modal
          opened={opened}
          onClose={close}
          title="QR Code for Project"
          centered
          radius="xs"
          size="90%"
          padding="lg"
          className={styles.scrollBar}
        >
          <Center>
            <div>
              <Text c="graycolor.3" mt="md">
                Share this QR code to your guests
              </Text>
              <Image src={qrCodeDataUrl} alt="QR Code" />

              <Center>
                <Anchor
                  href={qrCodeDataUrl}
                  download={`${project?.title}_qr_code.png`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download QR Code
                </Anchor>
              </Center>
            </div>
          </Center>
        </Modal>
      </>
    );
  };

  const deleteProjectImage = async (
    projectId: number,
    projectImage: string
  ) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .delete(
              `${
                import.meta.env.VITE_BASE_ENDPOINTMENT
              }projects/delete-project-image/${projectId}/${projectImage}`,
              {
                withCredentials: true,
              }
            )
            .then(() => {
              Swal.fire({
                title: "Deleted!",
                text: "Your project image has been deleted.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                fetchProject();
              });
            });
        }
      });
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const totalImages =
      files.length +
      acceptedFiles.length +
      (project?.project_image.length ?? 0);
    if (totalImages > 5) {
      const remainingSpace =
        5 - (project?.project_image.length ?? 0) - files.length;
      setFiles(files.concat(acceptedFiles.slice(0, remainingSpace)));
    } else {
      setFiles(files.concat(acceptedFiles));
    }
  };

  const handleUploadProjectImage = async (projectId: number) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    try {
      await axios
        .post(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }presenters/add-project-image/${projectId}`,
          formData,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setFiles([]);
          console.log("upload project image", res.data);
          Swal.fire({
            title: "Success",
            text: "Updated project description and images",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            fetchProject();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const deleteProjectDocument = async (
    projectId: number,
    projectDocument: string
  ) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .delete(
              `${
                import.meta.env.VITE_BASE_ENDPOINTMENT
              }projects/delete-project-document/${projectId}/${projectDocument}`,
              {
                withCredentials: true,
              }
            )
            .then((res) => {
              console.log("delete project document", res.data);
              Swal.fire({
                title: "Deleted!",
                text: "Your project document has been deleted.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                fetchProject();
              });
            });
        }
      });
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const ModalEditDescription = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [editedDescription, setEditedDescription] = useState(
      project?.description || ""
    );

    const content = project?.description || "";

    const handleEditDescription = () => {
      open();
      setEditedDescription(project?.description || "");
    };

    const updateProjectDescription = async (values: object) => {
      try {
        await axios
          .put(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }projects/update-description/${projectId}`,
            {
              description: (values as { description: string }).description,
            },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            handleUploadProjectImage(Number(projectId));
          });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

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
      content,
      onUpdate({ editor }) {
        setEditedDescription(editor.getHTML());
      },
    });

    const ModalProject = () => {
      const [opened, { open, close }] = useDisclosure(false);

      return (
        <>
          {project?.description && (
            <div>
              <Flex justify="space-between" align="end">
                <Text lineClamp={3}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(project?.description),
                    }}
                  />
                </Text>
                <ActionIcon variant="subtle" onClick={open} color="bluecolor.4">
                  <IconArrowsDiagonal size={14} stroke={1.5} />
                </ActionIcon>
              </Flex>
              <Modal
                opened={opened}
                onClose={close}
                title="Description"
                centered
                radius="xs"
                size="80%"
                padding="lg"
                className={styles.scrollBar}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(project?.description),
                  }}
                />
              </Modal>
            </div>
          )}
        </>
      );
    };

    return (
      <>
        <Flex align="center" gap="md" mb="xs">
          <Text c="graycolor.2">Description </Text>

          <ActionIcon
            variant="transparent"
            onClick={handleEditDescription}
            size="xs"
            color="graycolor.2"
          >
            <IconEdit size={14} stroke={1.5} onClick={open} />
          </ActionIcon>
        </Flex>

        <ModalProject />

        <Modal
          size={"80%"}
          opened={opened}
          onClose={close}
          title="Edit Project Description"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProjectDescription({ description: editedDescription });
            }}
          >
            <RichTextEditor editor={editor}>
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

              <RichTextEditor.Content />
            </RichTextEditor>

            <Flex justify="flex-end" mt="md" gap="md">
              <Button variant="outline" size="xs" onClick={close}>
                Cancel
              </Button>

              <Button variant="filled" size="xs" type="submit" onClick={close}>
                Save
              </Button>
            </Flex>
          </form>
        </Modal>
      </>
    );
  };

  return (
    <body>
      <Navbar />
      <div style={{ paddingBottom: "5rem" }}>
        {project && project !== null ? (
          <div>
            <Affix position={{ top: 90, left: 20 }}>
              <a href="/dashboard">
                <Button
                  size="xs"
                  leftSection={
                    <IconArrowLeft size={14} color="var(--bluecolor)" />
                  }
                  color="bluecolor.4"
                >
                  <Text c="bluecolor.9" size="small">
                    Back
                  </Text>
                </Button>
              </a>
            </Affix>
            <Box w="80%" mx="auto">
              <Flex justify="space-between" align="flex-start" my="xl">
                <div>
                  <ModalEdit />
                  <Flex mb="md" gap="2rem">
                    <div>
                      <Text size="xsmall" c="graycolor.3">
                        Start submit of project
                      </Text>
                      <Text>
                        {moment(event?.submit_start).format("LL [at] HH:mm A")}
                      </Text>
                    </div>
                    <div>
                      <Text size="xsmall" c="graycolor.3">
                        End submit of project
                      </Text>
                      <Text>
                        {moment(event?.submit_end).format("LL [at] HH:mm A")}
                      </Text>
                    </div>
                  </Flex>
                </div>
                <QrCodeModal />
              </Flex>
            </Box>
            <Card
              className={`${styles.cardContainer} ${styles.presenter}`}
              mx="auto"
              w="80%"
            >
              <Grid>
                <Grid.Col span={4}>
                  <Grid>
                    <Grid.Col span={4}>
                      <Text c="bluecolor.4">Location</Text>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <div>
                        <Text>
                          30th Year Building, Faculty of Engineering, Chiang Mai
                        </Text>
                      </div>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Text c="bluecolor.4">Status</Text>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <div>
                        {moment(event?.end_date).isBefore(moment()) ? (
                          <Text c="red.4">Ended</Text>
                        ) : (
                          <Text c="bluecolor.4">On going</Text>
                        )}
                      </div>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span="auto">
                  <SimpleGrid cols={{ base: 1, sm: 1 }}>{stats}</SimpleGrid>
                </Grid.Col>
                <GridCol span={1.5}>
                  <Stack h={125} align="flex-end" justify="space-between">
                    <div>
                      <Text size="small" c="graycolor.2">
                        Created at:
                      </Text>
                      <Text size="small" c="graycolor.2">
                        {moment(project.created_at).format("LL [at] HH:mm A")}
                      </Text>
                    </div>
                    <Button
                      rightSection={<IconArrowNarrowRight size={14} />}
                      size="small"
                      onClick={() => {
                        window.location.href = `/event/${project.event_id}`;
                      }}
                    >
                      Event
                    </Button>
                  </Stack>
                </GridCol>
                <Grid.Col span={12}>
                  <ModalEditDescription />
                </Grid.Col>
                <div>
                  <Text c="graycolor.2" mt="md">
                    Images
                  </Text>

                  <Dropzone accept={IMAGE_MIME_TYPE} onDrop={onDrop}>
                    <Button
                      mt="md"
                      leftSection={<IconPhotoUp size={14} />}
                      variant="default"
                    >
                      Upload Image
                    </Button>
                  </Dropzone>
                  {project?.project_image.length === 5 && (
                    <Text c="red.4" mt={3} size="sm">
                      You have reached the maximum number of images. Please
                      delete some images to upload new ones
                    </Text>
                  )}
                  {project?.project_image.length !== 0 || files.length !== 0 ? (
                    <>
                      <SimpleGrid cols={3} mt="md">
                        <div>
                          {files.map((file, index) => {
                            const imageUrl = URL.createObjectURL(file);
                            return (
                              <>
                                {/* <AspectRatio ratio={1080 / 720} maw={300} mx="auto"> */}
                                <Image
                                  radius={8}
                                  h={200}
                                  mt="sm"
                                  key={index}
                                  src={imageUrl}
                                  alt={`Preview ${index + 1}`}
                                  onLoad={() => URL.revokeObjectURL(imageUrl)}
                                />
                                {/* </AspectRatio> */}
                                <Button
                                  onClick={() => {
                                    setFiles(
                                      files.filter((_, i) => i !== index)
                                    );
                                  }}
                                  variant="light"
                                  size="sm"
                                  mt="md"
                                >
                                  <IconTrash size={14} />
                                </Button>
                              </>
                            );
                          })}
                        </div>
                      </SimpleGrid>
                      {files.length > 0 && (
                        <Center>
                          <Button
                            variant="filled"
                            size="xs"
                            mt="md"
                            mb="lg"
                            onClick={() =>
                              handleUploadProjectImage(Number(projectId))
                            }
                          >
                            Save
                          </Button>
                        </Center>
                      )}

                      <SimpleGrid cols={3} mt="md">
                        {project?.project_image.map((image) => (
                          <div>
                            {/* <AspectRatio ratio={1080 / 720} maw={300} mx="auto"> */}
                            <Image
                              src={image.project_image_url}
                              alt="Project image"
                              key={image.id}
                              h={200}
                              w="auto"
                            />
                            {/* </AspectRatio> */}
                            <Button
                              onClick={() => {
                                deleteProjectImage(
                                  image.project_id,
                                  image.project_image
                                ),
                                  open;
                              }}
                              variant="light"
                              size="sm"
                              mt="md"
                            >
                              <IconTrash size={14} />
                            </Button>
                          </div>
                        ))}
                      </SimpleGrid>
                    </>
                  ) : (
                    <Text c="graycolor.2" mt="md">
                      No images yet!
                    </Text>
                  )}

                  <Text c="graycolor.2" mt="xl">
                    Documents
                  </Text>
                  <FileInput
                    accept="docx, pdf, pptx, xlsx"
                    // label="Upload files"
                    placeholder="Upload files"
                    onChange={(files) => {
                      setDocuments([...documents, ...files]);
                      console.log("files", documents);
                    }}
                    multiple
                  >
                    <Button
                      leftSection={<IconFile size={14} />}
                      variant="default"
                    >
                      Upload File
                    </Button>
                  </FileInput>
                  <div>
                    {documents.length > 0 && (
                      <>
                        {" "}
                        <Flex align="center" mt="md" justify="flex-start">
                          {documents.map((file, index) => (
                            <div>
                              <Text size="sm" ml="md" c="graycolor.2">
                                {file.name} ({file.size / 1000000} MB)
                              </Text>
                              <Button
                                ml="md"
                                variant="light"
                                size="xs"
                                mt="md"
                                onClick={() => {
                                  setDocuments(
                                    documents.filter((_, i) => i !== index)
                                  );
                                }}
                              >
                                <IconTrash size={14} />
                              </Button>
                            </div>
                          ))}
                        </Flex>
                        {documents.map((file, index) => {
                          file.size / 1000000 > 10
                            ? Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "File size must be less than 10 MB",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  setDocuments(
                                    documents.filter((_, i) => i !== index)
                                  );
                                }
                              })
                            : null;
                        })}
                        <Center mt="md">
                          <Text size="sm" c="graycolor.2">
                            {documents.length} files selected
                          </Text>
                        </Center>
                      </>
                    )}
                  </div>
                  {documents.length > 0 && (
                    <Center>
                      <Button
                        variant="filled"
                        size="xs"
                        mt="md"
                        mb="lg"
                        onClick={() => {
                          uploadProjectDocument(Number(projectId));
                        }}
                      >
                        Save
                      </Button>
                    </Center>
                  )}
                  <SimpleGrid cols={3} mt="md">
                    {project?.project_document.map((document) => (
                      <Flex align="center" gap="md">
                        <Anchor
                          ml="md"
                          href={document.document_url}
                          ta="start"
                          target="_blank"
                          rel="noreferrer"
                          underline="always"
                          c={"bluecolor.4"}
                        >
                          {document.document_name}
                        </Anchor>
                        <ActionIcon
                          onClick={() => {
                            deleteProjectDocument(
                              document.project_id,
                              document.document_name
                            );
                          }}
                          variant="subtle"
                          size="xs"
                          color="redcolor.4"
                        >
                          <IconTrash size={14} stroke={1.5} />
                        </ActionIcon>
                      </Flex>
                    ))}
                  </SimpleGrid>
                </div>
              </Grid>
            </Card>
            <Card mx="auto" w="80%" mt="xl" p="0" bg="none">
              <Text c="bluecolor.4" fw={600} size="topic">
                Feedback
              </Text>
              {moment(event?.end_date).isBefore(moment()) ? (
                <>
                  {Array.isArray(comment) && comment.length !== 0 ? (
                    comment.map((comment: CommentType) => (
                      <Card
                        shadow="lg"
                        mt="lg"
                        className={`${styles.commentContainer} ${styles.presenter}`}
                      >
                        <Grid key={comment.id} gutter="md">
                          <Grid.Col span={11}>
                            <Flex align="center" gap="md" mb="sm">
                              <IconUserQuestion size={14} />
                              <Text>{comment.anonymousName}</Text>
                            </Flex>
                            <Text>{comment.comment}</Text>
                            <Text c="bluecolor.4" size="small" fw={500} mt="xs">
                              {moment(comment.created_at).fromNow()}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={1} ta="end">
                            <Text c="graycolor.2" size="small">
                              # {comment.id}
                            </Text>
                          </Grid.Col>
                        </Grid>
                      </Card>
                    ))
                  ) : (
                    <Text c="pink.5">No comments yet!</Text>
                  )}
                </>
              ) : (
                <>
                  <Center h="20rem">
                    <div style={{ textAlign: "center" }}>
                      <Text c="graycolor.2" fw={400}>
                        Feedbacks will be available after the event ends on{" "}
                        {moment(event?.end_date).format("LL [at] HH:mm A")}{" "}
                      </Text>
                      <Box
                        bg="bluecolor.1"
                        w="max-content"
                        mx="auto"
                        mt="md"
                        p="0.5rem"
                        style={{ borderRadius: "0.2rem" }}
                      >
                        <Text c="bluecolor.4" fw={700}>
                          {moment(event?.end_date).endOf("hour").fromNow()}
                        </Text>
                      </Box>
                    </div>
                  </Center>
                </>
              )}
            </Card>
          </div>
        ) : null}
      </div>

      <Affix className={` ${styles.footer} ${styles.presenter}`}>
        <Center h="1.5rem">
          <Text c="bluecolor.1" size="small" ta="center">
            Presenter
          </Text>
        </Center>
      </Affix>
    </body>
  );
}
