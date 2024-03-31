import { useEffect, useRef, useState } from "react";
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
  AspectRatio,
  Tooltip,
  Button,
  TextInput,
  rem,
  Center,
  Pagination,
  Anchor,
  Modal,
  Tabs,
  Affix,
  Select,
  LoadingOverlay,
  FileInput,
  Badge,
  Loader,
  Title,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { useClipboard, useDisclosure } from "@mantine/hooks";

import moment from "moment";

import styles from "../styles.module.css";
import QRCode from "qrcode";
import {
  IconCoins,
  IconDotsVertical,
  IconEdit,
  IconLayoutGridAdd,
  IconQrcode,
  IconTrash,
  IconUserQuestion,
  IconSearch,
  IconArrowsDiagonal,
  IconUserShare,
  IconSquarePlus,
  IconPresentationAnalytics,
  IconInfoSquare,
  IconChartBar,
  IconClock,
  IconPhotoUp,
  IconFile,
  IconLink,
  IconClockHour3,
  IconChartPie,
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
import Navbar from "../components/navbar";
import EditDescriptionEvent from "./editDescriptionEvent";
import { DateInput, TimeInput } from "@mantine/dates";
import EventResult from "./eventResult";
import EventSummary from "./eventSummary";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

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
  location: string;
}

type ProjectType = {
  project_document: string;
  project_image: string;
  created_at: string;
  virtual_money: number;
  map(
    arg0: (project: ProjectType) => import("react/jsx-runtime").JSX.Element
  ): import("react").ReactNode;
  id: number;
  title: string;
  description: string;
  user_id: number;
};

type EventFeedbackType = {
  total_virtual_money: number;
};

const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINTMENT;

export default function Event() {
  const refStartTime = useRef<HTMLInputElement>(null);
  const refEndTime = useRef<HTMLInputElement>(null);
  const rerSubmitStart = useRef<HTMLInputElement>(null);
  const rerSubmitEnd = useRef<HTMLInputElement>(null);
  const { eventId } = useParams();
  const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");
  const [guestQrCodeDataUrl, setGuestQRCodeDataUrl] = useState("");
  // const clipboard = useClipboard({ timeout: 500 });
  const guestClipboard = useClipboard({ timeout: 500 });
  const presenterClipboard = useClipboard({ timeout: 500 });

  const [event, setEvent] = useState<EventType | null>(null);
  const [totalProjects, setTotalProjects] = useState(0);
  const [projects, setProjects] = useState<ProjectType | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [editStartDateEvent, setEditStartDateEvent] = useState(false);
  const [editEndDateEvent, setEditEndDateEvent] = useState(false);
  const [editEventName, setEditEventName] = useState(false);
  const [editSubmissionStart, setEditSubmissionStart] = useState(false);
  const [editSubmissionEnd, setEditSubmissionEnd] = useState(false);
  const [editVirtualMoney, setEditVirtualMoney] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editLocation, setEditLocation] = useState(false);

  const [canEdit, setCanEdit] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [eventFeedback, setEventFeedback] = useState<EventFeedbackType | null>(
    null
  );

  const [visible, { toggle: toggleCreateProject }] = useDisclosure(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [isProjectDataLoading, setIsProjectDataLoading] = useState(true);
  const [userId, setUserId] = useState(null);

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

  Chart.register(CategoryScale);

  const editorDescription = useEditor({
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
      if (editorDescription) {
        descriptionForm.setFieldValue(
          "description",
          editorDescription.getHTML()
        );
      }
    },
  });

  const fetchData = async () => {
    try {
      await axios
        .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`, {
          withCredentials: true,
        })
        .then((res) => {
          // console.log("event data", res.data.data);
          setTotalProjects(res.data.totalProjects);
          setEvent(res.data.data);
        })
        .catch(() => {
          // console.log(err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const form2 = useForm({
    initialValues: {
      startDate: "",
      eventName: "",
      endDate: "",
      location: "",
    },

    validate: {
      endDate: (value) => {
        if (moment(value).isBefore(form2?.values.startDate)) {
          return "End date must be after start date";
        }
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`, {
            withCredentials: true,
          })
          .then((res) => {
            // console.log("event data", res.data.data);
            setTotalProjects(res.data.totalProjects);
            setEvent(res.data.data);
            setIsPublished(res.data.data.published);
            form2.setFieldValue("eventName", res.data.data.event_name || "");
            form2.setFieldValue(
              "startDate",
              moment(res.data.data.start_date).format("MMMM D, YYYY HH:mm") ||
                ""
            );
            form2.setFieldValue(
              "endDate",
              moment(res.data.data.end_date).format("MMMM D, YYYY HH:mm") || ""
            );
            form3.setFieldValue(
              "submissionStart",
              moment(res.data.data.submit_start).format("MMMM D, YYYY HH:mm") ||
                ""
            );
            form3.setFieldValue(
              "submissionEnd",
              moment(res.data.data.submit_end).format("MMMM D, YYYY HH:mm") ||
                ""
            );
          })
          .catch(() => {
            // console.log(err);
          });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchData();
    const fetchRole = async () => {
      try {
        await axios
          .get(
            `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/role/${eventId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            // console.log("role", res.data);
            setUserId(res.data.user_id);
            if (res.data.role === "manager") {
              setCanEdit(true);
            }
          })
          .catch(() => {
            // console.log(err);
          });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchRole();
    const generateQRCode = async () => {
      try {
        const url = `${
          import.meta.env.VITE_FRONTEND_ENDPOINT
        }/presenters/${eventId}`;
        const dataUrl = await QRCode.toDataURL(url);
        setQRCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    const generateGuestQrCode = async () => {
      try {
        const url = `${
          import.meta.env.VITE_FRONTEND_ENDPOINT
        }/guest/${eventId}`;
        const dataUrl = await QRCode.toDataURL(url);
        setGuestQRCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    const fetchEventFeedback = async () => {
      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }events/event-feedback/${eventId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            setEventFeedback(res.data.data);
          });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (eventId) {
      generateQRCode();
      generateGuestQrCode();
      fetchEventFeedback();
    }

    document.title = `${event?.event_name} | Virtual Event Manager`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, event?.event_name, query, page, pageSize]);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const response = await axios.get(
          `${BASE_ENDPOINT}presenters/get-project/${eventId}`,
          {
            withCredentials: true,
          }
        );
        // console.log("project data", response.data.data);
        setIsProjectDataLoading(false);
        setProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setIsProjectDataLoading(false);
      }
    };
    fetchProjectsData();
  }, [eventId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setPage(1); // Reset page to 1 when search term changes
  };

  const filteredData = (projects as unknown as ProjectType[])?.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  const paginatedData = (filteredData || []).slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handlePublishToggle = async () => {
    await axios
      .put(
        `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}/publish`,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        // console.log("dd", res.data);
      })
      .catch(() => {
        // console.log(err);
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
    //   title: "Comment by Guests",
    //   icon: "guests",
    //   value: "1234",
    //   label: "Number of guests",
    // },
    {
      title: "All virtual money",
      icon: "money",
      value: eventFeedback?.total_virtual_money || 0,
      label: "Number of virtual money",
    },
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

  const [addProjectOpened, { toggle: toggleAddProject }] = useDisclosure(false);

  const [thumbnails, setThumbnails] = useState<EventType | null>(null);

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }events/thumbnail/${eventId}`,
          {
            withCredentials: true,
          }
        );

        const eventData = response.data.data[0];
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

  const [files, setFiles] = useState<FileWithPath[]>([]);

  const onDrop = (acceptedFiles: FileWithPath[]) => {
    if (files.length + acceptedFiles.length > 5) {
      // If adding these files exceeds the limit, only take the first 5 files
      setFiles(files.concat(acceptedFiles.slice(0, 5 - files.length)));
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
          `${BASE_ENDPOINT}presenters/add-project-image/${projectId}`,
          formData,
          {
            withCredentials: true,
          }
        )
        .then(() => {
          // console.log("upload project image", res.data);
          toggleCreateProject();
        })
        .catch(() => {
          // console.log(err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleUploadDocument = async (projectId: number) => {
    const formData = new FormData();
    documents.forEach((file) => {
      formData.append("file", file);
    });

    try {
      await axios
        .post(
          `${BASE_ENDPOINT}projects/upload-documents/${projectId}`,
          formData,
          {
            withCredentials: true,
          }
        )
        .then(() => {
          // console.log("upload document", res.data);
        })
        .catch(() => {
          // console.log(err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

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
              // console.log("create project", res.data.data);
              if (files.length > 0) {
                toggleCreateProject();
                handleUploadProjectImage(res.data.data.id);
              }
              if (documents.length > 0) {
                handleUploadDocument(res.data.data.id);
              }
              Swal.fire({
                title: "Success",
                text: "Create project success",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                window.location.reload();
              });
            })
            .catch(() => {
              // console.log(err);
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

  const descriptionForm = useForm({
    initialValues: {
      description: event?.description,
    },
  });

  const handleDataChange = (data: boolean) => {
    setEditDescription(data);
    if (data === false) {
      fetchData();
    }
  };

  const ModalEvent = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        {editDescription ? (
          <>
            <EditDescriptionEvent
              data={{
                onDataChange: (data) => {
                  handleDataChange(data.value);
                },
                description: event?.description ?? "", // Provide a default value of an empty string
                eventId: parseInt(eventId ?? ""),
              }}
            />
          </>
        ) : (
          <>
            <Flex align="flex-end">
              <Text lineClamp={5}>
                <div
                  dangerouslySetInnerHTML={{ __html: event?.description ?? "" }}
                />
              </Text>
              <ActionIcon variant="subtle" onClick={open} color="redcolor.4">
                <IconArrowsDiagonal size={14} stroke={1.5} />
              </ActionIcon>
            </Flex>

            <Modal
              opened={opened}
              onClose={close}
              title="Description"
              centered
              radius="xs"
              size="90%"
              padding="lg"
              className={styles.scrollBar} // Use your actual style class
            >
              <Text>
                <div
                  dangerouslySetInnerHTML={{ __html: event?.description ?? "" }}
                />
              </Text>
            </Modal>
          </>
        )}
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
          title="QR Code"
          centered
          radius="xs"
          padding="lg"
          className={styles.scrollBar}
        >
          <Title order={3}>Presenter QR Code</Title>
          <Center>
            <Image src={qrCodeDataUrl} alt="QR Code" my="sm" w={300} h={300} />
          </Center>
          <Center>
            <Anchor
              href={qrCodeDataUrl}
              download="qr-code-presenter.png"
              target="_blank"
              rel="noreferrer"
              c="redcolor.4"
            >
              <Button>Download QR Code</Button>
            </Anchor>
          </Center>

          <Title mt="50" order={3}>
            Guest QR Code
          </Title>
          <Center>
            <Image
              src={guestQrCodeDataUrl}
              alt="QR Code"
              my="sm"
              w={300}
              h={300}
            />
          </Center>

          <Center>
            <Anchor
              href={guestQrCodeDataUrl}
              download="qr-code-presenter.png"
              target="_blank"
              rel="noreferrer"
              c="redcolor.4"
            >
              <Button>Download QR Code</Button>
            </Anchor>
          </Center>
        </Modal>
      </>
    );
  };

  const ModalProject = ({ project }: { project: ProjectType }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        <Flex justify="space-between" align="end">
          <Text lineClamp={2}>
            <div
              dangerouslySetInnerHTML={{
                __html: project.description,
              }}
            />
          </Text>

          <ActionIcon variant="subtle" onClick={open} color="redcolor.4">
            <IconArrowsDiagonal size={14} stroke={1.5} />
          </ActionIcon>
        </Flex>

        <Modal
          opened={opened}
          onClose={close}
          title="Description"
          centered
          radius="xs"
          size="90%"
          padding="lg"
          className={styles.scrollBar}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: project.description,
            }}
          />
          <Flex justify="flex-start">
            {Array.isArray(project.project_image) &&
              project.project_image.map(
                (image: { project_image_url: string }, index) => (
                  <Image
                    m="md"
                    src={image.project_image_url}
                    alt={`Thumbnail for ${image.project_image_url}`}
                    key={index}
                    h={200}
                    w="auto"
                  />
                )
              )}
          </Flex>
          {project.project_document.length > 0 && (
            <Text c="graycolor.3" mt="md">
              File Attachment
            </Text>
          )}
          <Flex justify="flex-start">
            {Array.isArray(project.project_document) &&
              project.project_document.map(
                (
                  document: {
                    document_name: string;
                    document_url: string;
                  },
                  index
                ) => (
                  <>
                    <Badge p="sm" mt="sm" key={index} color="blue" mx="sm">
                      <Anchor
                        href={document.document_url}
                        target="_blank"
                        rel="noreferrer"
                        c="white"
                      >
                        {document.document_name}
                      </Anchor>
                    </Badge>
                  </>
                )
              )}
          </Flex>
        </Modal>
      </>
    );
  };

  const form3 = useForm({
    initialValues: {
      submissionStart: "",
      submissionEnd: moment(event?.submit_end).format("MMMM D, YYYY HH:mm"),
    },

    validate: {
      submissionEnd: (value) => {
        if (moment(value).isBefore(form3?.values.submissionStart)) {
          return "End date must be after start date";
        }
      },
    },
  });

  const virtualMoneyForm = useForm({
    initialValues: {
      virtualMoney: 0,
      unitMoney: "",
    },
  });

  const handleEdit = () => {
    if (editStartDateEvent) {
      // If in edit mode, reset the form values
      if (event?.start_date) {
        form2?.setFieldValue(
          "startDate",
          moment(event?.start_date).format("MMMM D, YYYY HH:mm")
        );
      }
    } else {
      // Set the initial values for the input fields
      form2?.setFieldValue(
        "startDate",
        moment(event?.start_date).format("MMMM D, YYYY HH:mm")
      );
    }
    setEditStartDateEvent(!editStartDateEvent);
  };

  const handleEditEventName = () => {
    if (editEventName) {
      // If in edit mode, reset the form values
      if (event?.event_name) {
        form2?.setFieldValue("eventName", event?.event_name);
      }
    } else {
      // Set the initial values for the input fields
      form2?.setFieldValue("eventName", event?.event_name ?? "");
    }
    setEditEventName(!editEventName);
  };

  const handleEditEndDate = () => {
    if (editEndDateEvent) {
      // If in edit mode, reset the form values
      if (event?.end_date) {
        form2?.setFieldValue(
          "endDate",
          moment(event?.end_date).format("MMMM D, YYYY HH:mm")
        );
      }
    } else {
      // Set the initial values for the input fields
      form2?.setFieldValue(
        "endDate",
        moment(event?.end_date).format("MMMM D, YYYY HH:mm")
      );
    }
    setEditEndDateEvent(!editEndDateEvent);
  };

  const handleSubmissionStart = () => {
    if (editSubmissionStart) {
      if (event?.submit_start) {
        form3?.setFieldValue(
          "submissionStart",
          moment(event?.submit_start).format("MMMM D, YYYY HH:mm")
        );
      }
    } else {
      form3?.setFieldValue(
        "submissionStart",
        moment(event?.submit_start).format("MMMM D, YYYY HH:mm")
      );
    }
    setEditSubmissionStart(!editSubmissionStart);
  };

  const handleSubmissionEnd = () => {
    if (editSubmissionEnd) {
      if (event?.submit_end) {
        form3?.setFieldValue(
          "submissionEnd",
          moment(event?.submit_end).format("MMMM D, YYYY HH:mm")
        );
      }
    } else {
      form3?.setFieldValue(
        "submissionEnd",
        moment(event?.submit_end).format("MMMM D, YYYY HH:mm")
      );
    }
    setEditSubmissionEnd(!editSubmissionEnd);
  };

  const handleEditVirtualMoney = () => {
    if (editVirtualMoney) {
      if (event?.virtual_money && event?.unit_money) {
        virtualMoneyForm?.setFieldValue("virtualMoney", event?.virtual_money);
        virtualMoneyForm?.setFieldValue("unitMoney", event?.unit_money);
      }
    } else {
      virtualMoneyForm?.setFieldValue(
        "virtualMoney",
        event?.virtual_money ?? 0
      );
      virtualMoneyForm?.setFieldValue("unitMoney", event?.unit_money ?? "");
    }
    setEditVirtualMoney(!editVirtualMoney);
  };

  const handleEditLocation = () => {
    if (editLocation) {
      if (event?.location) {
        form2?.setFieldValue("location", event?.location);
      }
    } else {
      form2?.setFieldValue("location", event?.location ?? "");
    }
    setEditLocation(!editLocation);
  };

  const pickerControlStartTime = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refStartTime.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerControlEndTime = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refEndTime.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerControlSubmissionStart = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => rerSubmitStart.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerControlSubmissionEnd = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => rerSubmitEnd.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const updateEvent = async () => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            virtual_money: virtualMoneyForm?.values.virtualMoney,
            unit_money: virtualMoneyForm?.values.unitMoney,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditVirtualMoney(false);
          setEvent(res.data.data);
        })
        .catch(() => {
          // console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const updateEventName = async () => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            event_name: form2?.values.eventName,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditEventName(false);
          setEvent(res.data.data);
        })
        .catch(() => {
          // console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const updateEventStart = async () => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            start_date: moment(form2?.values.startDate).toISOString(),
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditStartDateEvent(false);
          setEvent(res.data.data);
        })
        .catch(() => {
          // console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const updateEventEnd = async () => {
    try {
      // console.log(`update end date`, {
      //   // start_date: moment(form2?.values.startDate).toISOString(),
      //   end_date: moment(form2?.values.endDate).toISOString(),
      // });
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            end_date: moment(form2?.values.endDate).toISOString(),
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditEndDateEvent(false);
          setEvent(res.data.data);
        })
        .catch(() => {
          // console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const updateEventLocation = async () => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            location: form2?.values.location,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditLocation(false);
          setEvent(res.data.data);
        })
        .catch(() => {
          // console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const updateEventProjectStartSubmission = async () => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            submit_start: moment(form3?.values.submissionStart).toISOString(),
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditSubmissionStart(false);
          setEvent(res.data.data);
        })
        .catch(() => {
          // console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const updateEventProjectEndSubmission = async () => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            submit_end: moment(form3?.values.submissionEnd).toISOString(),
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditSubmissionEnd(false);
          setEvent(res.data.data);
        })
        .catch(() => {
          // console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDeleteEvent = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios
            .delete(
              `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
              {
                withCredentials: true,
              }
            )
            .then(() => {
              Swal.fire({
                title: "Success",
                text: "Delete event success",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                window.location.href = "/dashboard";
              });
            })
            .catch(() => {
              // console.log(err);
              Swal.fire({
                title: "Error",
                text: "Delete event error",
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

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div>
        <AspectRatio ratio={1080 / 720} maw={300} mx="auto">
          <Image
            radius={8}
            mt="sm"
            mx={10}
            key={index}
            src={imageUrl}
            alt={`Preview ${index + 1}`}
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
        </AspectRatio>

        <Button
          onClick={() => {
            setFiles(files.filter((_, i) => i !== index));
          }}
          variant="light"
          size="sm"
          mt="md"
          mx={10}
        >
          <IconTrash size={14} />
        </Button>
      </div>
    );
  });

  const ChangeThumbnail = () => {
    const [file, setFile] = useState<File | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        {thumbnails && thumbnails && (
          <div style={{ position: "relative" }}>
            <ModalThumbnail />

            {canEdit && (
              <Button
                onClick={open}
                leftSection={<IconEdit size={14} />}
                variant="white"
                size="xs"
                style={{ position: "absolute", bottom: "1rem", right: "1rem" }}
              >
                Change Thumbnail
              </Button>
            )}

            <Modal
              opened={opened}
              onClose={close}
              title="Upload Thumbnail"
              centered
              radius="xs"
              size="90%"
              padding="lg"
              className={styles.scrollBar}
            >
              <Flex justify="center" align="center" direction="column">
                <Text size="lg" mb="md">
                  Upload Thumbnail
                </Text>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                <Button
                  onClick={() => {
                    (
                      document.querySelector(
                        'input[type="file"]'
                      ) as HTMLInputElement
                    )?.click();
                  }}
                >
                  Choose File
                </Button>

                {file && (
                  <div>
                    <Text size="sm" mt="md" mb="sm">
                      Preview:
                    </Text>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Thumbnail Preview"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (file) {
                      const formData = new FormData();
                      formData.append("file", file as Blob);
                      axios
                        .post(
                          `${
                            import.meta.env.VITE_BASE_ENDPOINTMENT
                          }events/upload/thumbnail/${eventId}`,
                          formData,
                          {
                            withCredentials: true,
                          }
                        )
                        .then((res) => {
                          setThumbnails(res.data.data.thumbnail_url);
                          close();
                        })
                        .catch(() => {
                          // console.log("update thumbnail err", err);
                        });
                    }
                  }}
                  mt="md"
                >
                  Upload
                </Button>
              </Flex>
            </Modal>
          </div>
        )}
      </>
    );
  };

  const ModalThumbnail = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        <Modal
          opened={opened}
          onClose={close}
          title="Event cover image"
          size="90%"
          centered
        >
          <Image src={thumbnails} alt={`Thumbnail for ${thumbnails}`} />
        </Modal>

        <AspectRatio ratio={970 / 150} maw="100vw" onClick={open}>
          <Image src={thumbnails} alt={`Thumbnail for ${thumbnails}`} />
        </AspectRatio>
      </>
    );
  };

  return (
    <body>
      <Navbar />

      <div style={{ marginBottom: "3.5rem" }}>
        <ChangeThumbnail />

        {/* event information */}
        <Box w="80%" mx="auto">
          <Flex justify="space-between" align="flex-start" mt="xl" mb="md">
            <div>
              <form
                onSubmit={form2.onSubmit(() => {
                  updateEventName();
                })}
              >
                <Text c="redcolor.4" fw={600} size="header" mb="xs">
                  {editEventName ? (
                    <TextInput
                      label="Event Name"
                      placeholder="Event Name"
                      value={form2?.values.eventName}
                      required
                      onChange={(e) => {
                        form2?.setFieldValue("eventName", e.target.value);
                      }}
                    />
                  ) : (
                    <>
                      <Flex align="center">
                        <Text size="header" c="redcolor.4" fw={600}>
                          {event?.event_name}
                        </Text>
                        {canEdit && (
                          <Button
                            rightSection={<IconEdit size={14} />}
                            onClick={handleEditEventName}
                            variant="white"
                            size="xs"
                          />
                        )}
                      </Flex>
                    </>
                  )}
                  {editEventName ? (
                    <Button
                      onClick={handleEditEventName}
                      variant="white"
                      size="xs"
                      mt="md"
                    >
                      Cancel
                    </Button>
                  ) : null}
                  {editEventName && (
                    <Button
                      variant="light"
                      size="xs"
                      mt="md"
                      rightSection
                      type="submit"
                    >
                      Save
                    </Button>
                  )}
                </Text>
              </form>
              <Grid mb="md" gutter="3rem">
                <form onSubmit={form2.onSubmit(updateEventStart)}>
                  <Grid.Col span="auto">
                    <Flex align="center">
                      <Text size="xsmall" c="graycolor.4">
                        Start event
                      </Text>
                      {canEdit && (
                        <Button
                          rightSection={<IconEdit size={14} />}
                          onClick={handleEdit}
                          variant="white"
                          color="graycolor.2"
                          size="xs"
                        />
                      )}
                    </Flex>

                    {editStartDateEvent ? (
                      <>
                        <DateInput
                          label="Start of event"
                          required
                          value={moment(form2?.values.startDate).toDate()}
                          onChange={(date) => {
                            form2?.setFieldValue(
                              "startDate",
                              moment(date).format("MMMM D, YYYY") +
                                " " +
                                moment(form2?.values.startDate).format("HH:mm")
                            );
                          }}
                        />
                        <TimeInput
                          mt="xs"
                          label="Start Event Time"
                          required
                          ref={refStartTime}
                          rightSection={pickerControlStartTime}
                          value={moment(form2?.values.startDate).format(
                            "HH:mm"
                          )}
                          onChange={(date) => {
                            form2?.setFieldValue(
                              "startDate",
                              moment(form2?.values.startDate).format(
                                "MMMM D, YYYY"
                              ) +
                                " " +
                                date.target.value
                            );
                          }}
                        />
                      </>
                    ) : (
                      <div>
                        <Text c="redcolor.4">
                          {moment(event?.start_date).format("LL")}
                        </Text>

                        <Flex align="center" gap="xs">
                          <IconClockHour3 size={14} />
                          {moment(event?.start_date).format("hh:mm A")}
                        </Flex>
                      </div>
                    )}

                    {editStartDateEvent ? (
                      <Button
                        onClick={handleEdit}
                        variant="white"
                        size="xs"
                        mt="md"
                      >
                        Cancel
                      </Button>
                    ) : null}
                    {editStartDateEvent && (
                      <Button variant="light" size="xs" mt="md" type="submit">
                        Save
                      </Button>
                    )}
                  </Grid.Col>
                </form>

                <form onSubmit={form2.onSubmit(updateEventEnd)}>
                  <Grid.Col span="auto">
                    <Flex align="center">
                      <Text size="xsmall" c="graycolor.4">
                        End event
                      </Text>
                      {canEdit && (
                        <Button
                          rightSection={<IconEdit size={14} />}
                          onClick={handleEditEndDate}
                          variant="white"
                          color="graycolor.2"
                          size="xs"
                        />
                      )}
                    </Flex>

                    {editEndDateEvent ? (
                      <>
                        <DateInput
                          label="End of event"
                          required
                          value={moment(form2?.values.endDate).toDate()}
                          onChange={(date) => {
                            form2?.setFieldValue(
                              "endDate",
                              moment(date).format("MMMM D, YYYY") +
                                " " +
                                moment(form2?.values.endDate).format("HH:mm")
                            );
                          }}
                        />
                        <TimeInput
                          mt="xs"
                          label="End Event Time"
                          required
                          ref={refEndTime}
                          rightSection={pickerControlEndTime}
                          value={moment(form2?.values.endDate).format("HH:mm")}
                          onChange={(date) => {
                            form2?.setFieldValue(
                              "endDate",
                              moment(form2?.values.endDate).format(
                                "MMMM D, YYYY"
                              ) +
                                " " +
                                date.target.value
                            );
                          }}
                        />
                      </>
                    ) : (
                      <div>
                        <Text c="redcolor.4">
                          {moment(event?.end_date).format("LL")}
                        </Text>

                        <Flex align="center" gap="xs">
                          <IconClockHour3 size={14} />
                          {moment(event?.end_date).format("hh:mm A")}
                        </Flex>
                      </div>
                    )}

                    {editEndDateEvent ? (
                      <Button
                        onClick={handleEditEndDate}
                        variant="white"
                        size="xs"
                        mt="md"
                      >
                        Cancel
                      </Button>
                    ) : null}
                    {editEndDateEvent && (
                      <Button variant="light" size="xs" mt="md" type="submit">
                        Save
                      </Button>
                    )}
                  </Grid.Col>
                </form>

                <form onSubmit={form2.onSubmit(updateEventLocation)}>
                  <Grid.Col span="auto">
                    <Flex align="center">
                      <Text size="xsmall" c="graycolor.3">
                        Location
                      </Text>
                      {canEdit && (
                        <Button
                          rightSection={<IconEdit size={14} />}
                          onClick={handleEditLocation}
                          variant="white"
                          color="graycolor.2"
                          size="xs"
                        />
                      )}
                    </Flex>
                    {editLocation ? (
                      <>
                        <TextInput
                          label="Location"
                          placeholder="Location"
                          value={form2?.values.location}
                          required
                          onChange={(e) => {
                            // console.log("e", e.target.value);
                            form2?.setFieldValue("location", e.target.value);
                          }}
                        />
                        <Button
                          onClick={handleEditLocation}
                          variant="white"
                          size="xs"
                          mt="md"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="light"
                          size="xs"
                          mt="md"
                          rightSection
                          type="submit"
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <>{event?.location ? event?.location : "No location"}</>
                    )}
                  </Grid.Col>
                </form>
              </Grid>
            </div>
            <Flex align="center" justify="flex-end" gap="md">
              <Group>
                {canEdit && (
                  <Tooltip label="Publish event" refProp="rootRef">
                    <Switch
                      checked={isPublished}
                      onChange={handlePublishToggle}
                      onLabel="Unpublish"
                      offLabel="Publish"
                      id="publish-toggle"
                      size="lg"
                      color="greencolor.7"
                    />
                  </Tooltip>
                )}
                <ActionIcon.Group>
                  <QrCodeModal />
                  <Menu position="bottom-end" shadow="sm">
                    <Menu.Target>
                      <ActionIcon variant="default" size="lg">
                        <IconLink size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconUserShare size={14} />}
                        color="bluecolor.4"
                      >
                        <Anchor
                          target="_blank"
                          onClick={() => {
                            presenterClipboard.copy(
                              `${
                                import.meta.env.VITE_FRONTEND_ENDPOINT
                              }/presenter/${eventId}`
                            );
                            Swal.fire({
                              title: "Copied!",
                              text: "Link for presenter copied",
                              icon: "success",
                              timer: 2000,
                              showConfirmButton: false,
                            });
                          }}
                          underline="never"
                          c="bluecolor.4"
                        >
                          Link for{" "}
                          <Text span c="bluecolor.4" fw="600" inherit>
                            Presenter
                          </Text>
                        </Anchor>
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconUserQuestion size={14} />}
                        color="greencolor.4"
                      >
                        <Anchor
                          target="_blank"
                          onClick={() => {
                            guestClipboard.copy(
                              `${
                                import.meta.env.VITE_FRONTEND_ENDPOINT
                              }/guest/${eventId}`
                            );
                            Swal.fire({
                              title: "Copied!",
                              text: "Link for guest copied",
                              icon: "success",
                              timer: 2000,
                              showConfirmButton: false,
                            });
                          }}
                          underline="never"
                          c="greencolor.4"
                        >
                          Link for{" "}
                          <Text span c="greencolor.4" fw="600" inherit>
                            Guest
                          </Text>
                        </Anchor>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                  {canEdit && (
                    <Menu position="bottom-end" shadow="sm">
                      <Menu.Target>
                        <ActionIcon variant="default" size="lg">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                          onClick={handleDeleteEvent}
                        >
                          Delete event
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </ActionIcon.Group>
              </Group>
            </Flex>
          </Flex>
        </Box>
        {/* tabs menu */}
        <Tabs
          radius="xs"
          color="redcolor.4"
          defaultValue="infomation"
          w="80%"
          mx="auto"
          h="max-content"
        >
          <Tabs.List mb="2rem">
            <Tabs.Tab
              value="infomation"
              leftSection={<IconInfoSquare size={14} />}
            >
              Event Infomation
            </Tabs.Tab>
            <Tabs.Tab
              value="projects"
              leftSection={<IconPresentationAnalytics size={14} />}
            >
              Projects ({totalProjects})
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconChartBar size={14} />}>
              Result
            </Tabs.Tab>
            {canEdit && (
              <Tabs.Tab
                value="summary"
                leftSection={<IconChartPie size={14} />}
              >
                Summary
              </Tabs.Tab>
            )}
          </Tabs.List>
          <Tabs.Panel value="infomation">
            <Card className={styles.cardInformation} mx="auto">
              <Grid>
                <Grid.Col span={{ sm: 6, lg: 4 }}>
                  <Grid>
                    <Grid.Col span={4}>
                      <Text c="redcolor.4">Event Presenter</Text>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <div>
                        <form
                          onSubmit={form3.onSubmit(() =>
                            updateEventProjectStartSubmission()
                          )}
                        >
                          <Flex align="center">
                            <Text size="xsmall" c="graycolor.3">
                              Start submit project
                            </Text>
                            {canEdit && (
                              <Button
                                rightSection={<IconEdit size={14} />}
                                onClick={handleSubmissionStart}
                                variant="white"
                                color="graycolor.2"
                                size="xs"
                              />
                            )}
                          </Flex>
                          {editSubmissionStart ? (
                            <>
                              <DateInput
                                label="Submission Start"
                                required
                                value={moment(
                                  form3?.values.submissionStart
                                ).toDate()}
                                onChange={(date) => {
                                  form3?.setFieldValue(
                                    "submissionStart",
                                    moment(date).format("MMMM D, YYYY") +
                                      " " +
                                      moment(
                                        form3?.values.submissionStart
                                      ).format("HH:mm")
                                  );
                                }}
                              />
                              <TimeInput
                                mt="xs"
                                label="Submission Start Time"
                                required
                                ref={rerSubmitStart}
                                rightSection={pickerControlSubmissionStart}
                                value={moment(
                                  form3?.values.submissionStart
                                ).format("HH:mm")}
                                onChange={(date) => {
                                  form3?.setFieldValue(
                                    "submissionStart",
                                    moment(
                                      form3?.values.submissionStart
                                    ).format("MMMM D, YYYY") +
                                      " " +
                                      date.target.value
                                  );
                                }}
                              />
                              {form3.errors.submissionStart && (
                                <Text mt="sm" c="red">
                                  {form3.errors.submissionStart}
                                </Text>
                              )}
                            </>
                          ) : (
                            <>
                              <Grid align="center" gutter="md">
                                <Grid.Col span={5}>
                                  <Text c="redcolor.4">
                                    {moment(event?.submit_start).format("LL")}
                                  </Text>
                                </Grid.Col>
                                <Grid.Col span="content">
                                  <Flex align="center" gap="xs">
                                    <IconClockHour3 size={14} />
                                    {moment(event?.submit_start).format(
                                      "HH:MM A"
                                    )}
                                  </Flex>
                                </Grid.Col>
                              </Grid>
                            </>
                          )}
                          {editSubmissionStart ? (
                            <Button
                              onClick={handleSubmissionStart}
                              variant="white"
                              size="xs"
                              mt="md"
                              mb="md"
                            >
                              Cancel
                            </Button>
                          ) : null}
                          {editSubmissionStart && (
                            <Button
                              variant="light"
                              size="xs"
                              mt="md"
                              rightSection
                              type="submit"
                              mb="md"
                            >
                              Save
                            </Button>
                          )}
                        </form>
                        <form
                          onSubmit={form3.onSubmit(() =>
                            updateEventProjectEndSubmission()
                          )}
                        >
                          <Flex align="center">
                            <Text size="xsmall" c="graycolor.3">
                              End submit project
                            </Text>
                            {canEdit && (
                              <Button
                                rightSection={<IconEdit size={14} />}
                                onClick={handleSubmissionEnd}
                                variant="white"
                                color="graycolor.2"
                                size="xs"
                              />
                            )}
                          </Flex>
                          <Text>
                            {editSubmissionEnd ? (
                              <>
                                <DateInput
                                  label="Submission End"
                                  required
                                  value={moment(
                                    form3?.values.submissionEnd
                                  ).toDate()}
                                  onChange={(date) => {
                                    form3?.setFieldValue(
                                      "submissionEnd",
                                      moment(date).format("MMMM D, YYYY") +
                                        " " +
                                        moment(
                                          form3?.values.submissionEnd
                                        ).format("HH:mm")
                                    );
                                  }}
                                />
                                <TimeInput
                                  mt="xs"
                                  label="Submission End Time"
                                  required
                                  ref={rerSubmitEnd}
                                  rightSection={pickerControlSubmissionEnd}
                                  value={moment(
                                    form3?.values.submissionEnd
                                  ).format("HH:mm")}
                                  onChange={(date) => {
                                    form3?.setFieldValue(
                                      "submissionEnd",
                                      moment(
                                        form3?.values.submissionEnd
                                      ).format("MMMM D, YYYY") +
                                        " " +
                                        date.target.value
                                    );
                                  }}
                                />
                                {form3.errors.submissionEnd && (
                                  <Text mt="sm" c="red">
                                    {form3.errors.submissionEnd}
                                  </Text>
                                )}
                              </>
                            ) : (
                              <>
                                <Grid align="center" gutter="md">
                                  <Grid.Col span={5}>
                                    <Text c="redcolor.4">
                                      {moment(event?.submit_end).format("LL")}
                                    </Text>
                                  </Grid.Col>
                                  <Grid.Col span="content">
                                    <Flex align="center" gap="xs">
                                      <IconClockHour3 size={14} />
                                      {moment(event?.submit_end).format(
                                        "HH:MM A"
                                      )}
                                    </Flex>
                                  </Grid.Col>
                                </Grid>
                              </>
                            )}
                            {editSubmissionEnd ? (
                              <Button
                                onClick={handleSubmissionEnd}
                                variant="white"
                                size="xs"
                                mt="md"
                                mb="md"
                              >
                                Cancel
                              </Button>
                            ) : null}
                            {editSubmissionEnd && (
                              <Button
                                variant="light"
                                size="xs"
                                mt="md"
                                rightSection
                                type="submit"
                                mb="md"
                              >
                                Save
                              </Button>
                            )}
                          </Text>
                        </form>
                      </div>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Text c="redcolor.4">Guest</Text>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <div>
                        <Flex align="center">
                          <Text size="xsmall" c="graycolor.3">
                            Virtual Money
                          </Text>
                          {canEdit && (
                            <Button
                              rightSection={<IconEdit size={14} />}
                              onClick={handleEditVirtualMoney}
                              variant="white"
                              color="graycolor.2"
                              size="xs"
                            />
                          )}
                        </Flex>
                        <form
                          onSubmit={virtualMoneyForm.onSubmit(() =>
                            updateEvent()
                          )}
                        >
                          {editVirtualMoney ? (
                            <>
                              <TextInput
                                label="Virtual Money"
                                placeholder="Virtual Money"
                                value={
                                  virtualMoneyForm?.values.virtualMoney || 0
                                }
                                required
                                onChange={(e) => {
                                  // console.log("e", e.target.value);
                                  virtualMoneyForm?.setFieldValue(
                                    "virtualMoney",
                                    parseInt(e.target.value)
                                  );
                                }}
                              />
                              <TextInput
                                mt="sm"
                                label="Unit Money"
                                placeholder="Unit Money"
                                value={virtualMoneyForm?.values.unitMoney}
                                required
                                onChange={(e) => {
                                  // console.log("e", e.target.value);
                                  virtualMoneyForm?.setFieldValue(
                                    "unitMoney",
                                    e.target.value
                                  );
                                }}
                              />
                              <Flex justify="flex-start" mt="md">
                                <Button
                                  onClick={handleEditVirtualMoney}
                                  variant="white"
                                  size="xs"
                                  mt="md"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="light"
                                  size="xs"
                                  mt="md"
                                  rightSection
                                  type="submit"
                                >
                                  Save
                                </Button>
                              </Flex>
                            </>
                          ) : (
                            <>
                              {event?.virtual_money} {event?.unit_money}
                            </>
                          )}
                        </form>
                      </div>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span="auto">
                  <SimpleGrid cols={{ sm: 1, lg: 2 }}>{stats}</SimpleGrid>
                </Grid.Col>
                <Grid.Col>
                  <Flex justify="flex-start" align="center" mb="xs">
                    <Text w={500} c="graycolor.2">
                      Description
                      {canEdit && (
                        <Button
                          onClick={() => {
                            setEditDescription(!editDescription);
                          }}
                          leftSection={<IconEdit size={14} />}
                          variant="white"
                          color="graycolor.2"
                          size="xs"
                        />
                      )}
                    </Text>
                  </Flex>
                  <ModalEvent />
                </Grid.Col>
              </Grid>
            </Card>
          </Tabs.Panel>

          {/* projects container */}
          <Tabs.Panel value="projects" mt="3rem">
            <Box w="100%" mx="auto">
              <Flex justify="space-between" align="flex-start">
                {moment().isBefore(moment(event?.submit_start)) ? (
                  <div>
                    <Button
                      size="sm"
                      leftSection={<IconSquarePlus size={14} />}
                      onClick={toggleAddProject}
                      disabled
                    >
                      <Text c="pinkcolor.1" size="small">
                        Add Project
                      </Text>
                    </Button>
                    <Text mt="sm" size="small" c="redcolor.4">
                      Project submission will open in{" "}
                      {moment(event?.submit_start).format("LL HH:MM A")}
                    </Text>
                  </div>
                ) : moment().isBefore(moment(event?.submit_end)) ? (
                  <div>
                    <Button
                      size="sm"
                      leftSection={<IconSquarePlus size={14} />}
                      onClick={toggleAddProject}
                    >
                      <Text c="pinkcolor.1" size="small">
                        Add Project
                      </Text>
                    </Button>
                    <Text mt="sm" size="small" c="redcolor.4">
                      Project submission will close in{" "}
                      {moment(event?.submit_end).format("LL HH:MM A")}
                    </Text>
                  </div>
                ) : (
                  <div>
                    <Button
                      size="sm"
                      leftSection={<IconSquarePlus size={14} />}
                      onClick={toggleAddProject}
                      disabled
                    >
                      <Text c="pinkcolor.1" size="small">
                        Add Project
                      </Text>
                    </Button>
                    <Text mt="md" size="small" c="redcolor.4">
                      Project submission is closed
                    </Text>
                  </div>
                )}

                <Modal
                  title="Create New Project"
                  opened={addProjectOpened}
                  onClose={toggleAddProject}
                  centered
                  size="80%"
                >
                  <LoadingOverlay
                    visible={visible}
                    loaderProps={{ children: "Uploading..." }}
                  />
                  <form
                    onSubmit={form.onSubmit(() => {
                      onSubmit();
                    })}
                  >
                    <TextInput
                      label="Title"
                      placeholder="Project Title"
                      required
                      {...form.getInputProps("title")}
                    />

                    <Text size="base" mt="md" fw={500}>
                      Description
                    </Text>

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
                      {form.errors.description && (
                        <>{form.errors.description}</>
                      )}
                    </Text>

                    <div>
                      <FileInput
                        mt="md"
                        accept="docx, pdf, pptx, xlsx"
                        label="Upload files"
                        placeholder="Upload files"
                        onChange={(files) => {
                          setDocuments([...documents, ...files]);
                          // console.log("files", documents);
                        }}
                        multiple
                      >
                        <Button
                          mt="md"
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
                                    {file.name}
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
                                    Clear
                                  </Button>
                                </div>
                              ))}
                            </Flex>
                            <Center mt="md">
                              <Text size="sm" c="graycolor.2">
                                {documents.length} files selected
                              </Text>
                            </Center>
                          </>
                        )}
                      </div>
                      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={onDrop}>
                        <Button
                          mt="md"
                          leftSection={<IconPhotoUp size={14} />}
                          variant="default"
                        >
                          Upload Image
                        </Button>
                      </Dropzone>

                      <SimpleGrid
                        cols={{ base: 1, sm: 4 }}
                        mt={previews.length > 0 ? "xl" : 0}
                      >
                        {previews}
                      </SimpleGrid>
                      <Center>
                        {previews.length > 0 && (
                          <>
                            <Text size="sm" mt="md" c="graycolor.2">
                              {files.length} files selected
                            </Text>
                            <Button
                              ml="md"
                              variant="light"
                              size="xs"
                              mt="md"
                              onClick={() => {
                                setFiles([]);
                              }}
                            >
                              Clear
                            </Button>
                          </>
                        )}
                      </Center>
                    </div>

                    <Box ta="end">
                      <Button type="submit" size="sm" mt="md">
                        <Text c="pinkcolor.1" size="small">
                          Submit
                        </Text>
                      </Button>
                    </Box>
                  </form>
                </Modal>
                <TextInput
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Search project"
                  rightSection={<IconSearch size={14} />}
                  w="50%"
                />
                <Select
                  ml="md"
                  data={["5", "10", "15", "20"]}
                  value={pageSize.toString()}
                  onChange={(e) => {
                    if (e !== null) {
                      setPageSize(parseInt(e));
                    }
                  }}
                />
              </Flex>

              <div style={{ height: "100%", marginTop: "2rem" }}>
                {isProjectDataLoading ? (
                  <Flex justify="center" align="center" direction="column">
                    <Loader mt="md" type="dots" size="lg" color="redcolor.4" />
                  </Flex>
                ) : (
                  <>
                    {paginatedData.length > 0 ? (
                      <div>
                        {paginatedData.map((project: ProjectType) => (
                          <Card
                            key={project.id}
                            className={styles.cardInformation}
                            p="lg"
                            mt="1rem"
                          >
                            <Grid align="flex-start" gutter="2rem">
                              <Grid.Col span={2}>
                                <Text size="xsmall" c="graycolor.2">
                                  Project name
                                </Text>
                                <Text size="topic" fw={500} c="redcolor.4">
                                  {project.title}
                                </Text>
                              </Grid.Col>
                              <Grid.Col span="auto">
                                <Text size="xsmall" c="graycolor.2">
                                  Description
                                </Text>
                                <ModalProject project={project} />
                              </Grid.Col>

                              <Grid.Col
                                span={{ sm: 2, lg: "content" }}
                                ta="end"
                              >
                                <Text size="base" c="redcolor.4" fw={500}>
                                  {project.virtual_money}{" "}
                                  {project.virtual_money && event?.unit_money}
                                </Text>
                                <Text size="small" c="graycolor.2">
                                  {moment(project?.created_at).format(
                                    "LL [at] HH:mm A"
                                  )}
                                </Text>
                                <Text size="small" c="redcolor.2">
                                  {project.user_id === userId && (
                                    <ActionIcon
                                      variant="filled"
                                      color="red"
                                      mt="sm"
                                      size="md"
                                      onClick={() => {
                                        window.open(
                                          `/project/${project.id}`,
                                          "_blank"
                                        );
                                      }}
                                    >
                                      <IconEdit size={14} />
                                    </ActionIcon>
                                  )}
                                </Text>
                              </Grid.Col>
                            </Grid>
                          </Card>
                        ))}
                        <Center mt="md">
                          <Pagination.Root
                            color="redcolor.4"
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
                      </div>
                    ) : (
                      <div>
                        <Center>
                          <Text size="md" my="md" fw={500} c={"graycolor.4"}>
                            No Projects Found
                          </Text>
                        </Center>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="settings">
            {canEdit ? (
              <Card className={styles.cardInformation} mx="auto" mb="lg">
                <EventResult eventId={eventId} />
              </Card>
            ) : (
              <>
                {moment(event?.end_date).isAfter(moment()) ? (
                  <Card className={styles.cardContainer} mx="auto" mb="lg">
                    <Flex justify="center" align="center" direction="column">
                      <Text size="lg" c="redcolor.5" fw={600}>
                        Result
                      </Text>
                      <Text size="md" c="redcolor.3">
                        The result will be available after the event ends{" "}
                        {moment(event?.end_date).fromNow()}
                      </Text>
                    </Flex>
                  </Card>
                ) : (
                  <Card className={styles.cardInformation} mx="auto" mb="lg">
                    <EventResult eventId={eventId} />
                  </Card>
                )}
              </>
            )}
          </Tabs.Panel>
          {canEdit ? (
            <>
              <Tabs.Panel value="summary">
                <Card className={styles.cardInformation} mx="auto" mb="lg">
                  <EventSummary eventId={eventId} />
                </Card>
              </Tabs.Panel>
            </>
          ) : null}
        </Tabs>
      </div>

      {/* footer */}
      <Affix mt="2rem" className={` ${styles.footer} ${styles.event}`}></Affix>
    </body>
  );
}
