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
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";

import moment from "moment";

import styles from "../styles.module.css";
import QRCode from "qrcode";
import {
  IconArrowLeft,
  IconCoins,
  IconCopy,
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
  created_at: string;
  virtual_money: number;
  map(
    arg0: (project: ProjectType) => import("react/jsx-runtime").JSX.Element
  ): import("react").ReactNode;
  id: number;
  title: string;
  description: string;
};

const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINTMENT;

export default function Event() {
  const refStartTime = useRef<HTMLInputElement>(null);
  const refEndTime = useRef<HTMLInputElement>(null);
  const rerSubmitStart = useRef<HTMLInputElement>(null);
  const rerSubmitEnd = useRef<HTMLInputElement>(null);
  const { eventId } = useParams();
  const [qrCodeDataUrl, setQRCodeDataUrl] = useState("");
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
          // console.log(res.data.data);
          setTotalProjects(res.data.totalProjects);
          setEvent(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`, {
            withCredentials: true,
          })
          .then((res) => {
            // console.log(res.data.data);
            setTotalProjects(res.data.totalProjects);
            setEvent(res.data.data);
            setIsPublished(res.data.data.published);
          })
          .catch((err) => {
            console.log(err);
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
            // console.log("role", res.data.role);
            if (res.data.role === "manager") {
              setCanEdit(true);
            }
          })
          .catch((err) => {
            console.log(err);
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
        }/guest/event/${eventId}`;
        const dataUrl = await QRCode.toDataURL(url);
        setQRCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    const fetchProjectsData = async () => {
      await axios
        .get(`${BASE_ENDPOINT}presenters/get-project/${eventId}`, {
          withCredentials: true,
          params: { query, page, pageSize },
        })
        .then((res) => {
          setProjects(res.data.data);
          // console.log("project data dd", res.data);
        })
        .catch((err) => {
          console.log("projects err", err);
        });
    };

    if (eventId) {
      generateQRCode();
      fetchProjectsData();
    }

    document.title = `${event?.event_name} | Virtual Event Manager`;
  }, [eventId, event?.event_name, query, page, pageSize]);

  const handlePublishToggle = async () => {
    await axios
      .put(
        `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}/publish`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("dd", res.data);
      })
      .catch((err) => {
        console.log(err);
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
    {
      title: "Comment by Guests",
      icon: "guests",
      value: "1234",
      label: "Number of guests",
    },
    {
      title: "All virtual money",
      icon: "money",
      value: "745",
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
            .then(() => {
              Swal.fire({
                title: "Success",
                text: "Create project success",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                window.location.reload();
                // toggleAddProject();
              });
            })
            .catch((err) => {
              console.log(err);
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
        {/* <Flex align="flex-end">
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
        </Modal> */}
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
          title="QR Code for Presenter"
          centered
          radius="xs"
          size="90%"
          padding="lg"
          className={styles.scrollBar}
        >
          <Center>
            <div>
              <Text c="graycolor.3" mb="md">
                Scan QR code to join the event
              </Text>
              <Image src={qrCodeDataUrl} alt="QR Code" />

              <Center>
                <Anchor
                  href={qrCodeDataUrl}
                  download="qr-code-presenter.png"
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
        </Modal>
      </>
    );
  };

  const form2 = useForm({
    initialValues: {
      startDate: moment(event?.start_date).format("MMMM D, YYYY HH:mm"),
      eventName: event?.event_name,
      endDate: moment(event?.end_date).format("MMMM D, YYYY HH:mm"),
      location: event?.location,
    },

    validate: {
      endDate: (value) => {
        if (moment(value).isBefore(form2?.values.startDate)) {
          return "End date must be after start date";
        }
      },
    },
  });

  const form3 = useForm({
    initialValues: {
      submissionStart: moment(event?.submit_start).format("MMMM D, YYYY HH:mm"),
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
      virtualMoney: event?.virtual_money,
      unitMoney: event?.unit_money,
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
      form2?.setFieldValue("eventName", event?.event_name);
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
      virtualMoneyForm?.setFieldValue("virtualMoney", event?.virtual_money);
      virtualMoneyForm?.setFieldValue("unitMoney", event?.unit_money);
    }
    setEditVirtualMoney(!editVirtualMoney);
  };

  const handleEditLocation = () => {
    if (editLocation) {
      if (event?.location) {
        form2?.setFieldValue("location", event?.location);
      }
    } else {
      form2.setFieldValue("location", event?.location);
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

  const updateEventData = async () => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            event_name: form2?.values.eventName,
            start_date: moment(form2?.values.startDate).toISOString(),
            end_date: moment(form2?.values.endDate).toISOString(),
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditStartDateEvent(false);
          setEditEventName(false);
          setEditEndDateEvent(false);
          setEvent(res.data.data);
        })
        .catch((err) => {
          console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const updateEvent = async () => {
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            event_name: form2?.values.eventName,
            start_date: moment(form2?.values.startDate).toISOString(),
            end_date: moment(form2?.values.endDate).toISOString(),
            submit_start: moment(form3?.values.submissionStart).toISOString(),
            submit_end: moment(form3?.values.submissionEnd).toISOString(),
            virtual_money: virtualMoneyForm?.values.virtualMoney,
            unit_money: virtualMoneyForm?.values.unitMoney,
            location: form2?.values.location,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setEditStartDateEvent(false);
          setEditEventName(false);
          setEditEndDateEvent(false);
          setEditSubmissionStart(false);
          setEditSubmissionEnd(false);
          setEditVirtualMoney(false);
          setEditLocation(false);
          setEvent(res.data.data);
        })
        .catch((err) => {
          console.log("update start date err", err);
        });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const UpdateThumbnail = () => {
    const [file, setFile] = useState<File | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        {thumbnails && thumbnails && (
          <>
            {canEdit && (
              <Flex justify="flex-end">
                <Button
                  onClick={open}
                  leftSection={<IconEdit size={14} />}
                  variant="white"
                  size="xs"
                >
                  Change Thumbnail
                </Button>
              </Flex>
            )}
            <AspectRatio ratio={970 / 150} maw="100vw" mt="sm">
              <Image src={thumbnails} alt={`Thumbnail for ${thumbnails}`} />

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
                    style={{ display: "none" }} // Hide the default file input
                    accept="image/*" // Allow only image files
                  />
                  <Button
                    onClick={() => {
                      // Trigger the hidden file input
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
                            // console.log("update thumbnail", res.data);
                            setThumbnails(res.data.data.thumbnail_url);
                            close();
                          })
                          .catch((err) => {
                            console.log("update thumbnail err", err);
                          });
                      }
                    }}
                    mt="md"
                  >
                    Upload
                  </Button>
                </Flex>
              </Modal>
            </AspectRatio>
          </>
        )}
      </>
    );
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
            .catch((err) => {
              console.log(err);
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

  return (
    <body>
      {/* {eventId} */}
      <Navbar />
      <div>
        <Affix position={{ top: 90, left: 20 }}>
          <a href="/dashboard">
            <Button size="xs" leftSection={<IconArrowLeft size={14} />}>
              <Text c="pinkcolor.1" size="small">
                Back
              </Text>
            </Button>
          </a>
        </Affix>

        <Box w="80%" mx="auto">
          <Flex justify="space-between" align="flex-start" my="xl">
            <div>
              <form
                onSubmit={form2.onSubmit(() => {
                  updateEventData();
                })}
              >
                {/* 
                Event Name
             */}
                <Text c="redcolor.4" fw={600} size="topic" mb="xs">
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
                <Flex mb="md" gap="2rem">
                  <div>
                    <Flex align="center">
                      <Text size="xsmall" c="graycolor.3">
                        Start of event
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

                    {/* 
                    Start Date
                     */}
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
                      <>
                        <Text>
                          {moment(event?.start_date).format("LL [at] HH:mm")}
                        </Text>
                      </>
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
                  </div>

                  {/* 
                    End Date
                     */}
                  <div>
                    <Flex align="center">
                      <Text size="xsmall" c="graycolor.3">
                        End of event
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
                        {form2.errors.endDate && (
                          <Text mt="sm" c="red">
                            {form2.errors.endDate}
                          </Text>
                        )}
                      </>
                    ) : (
                      <>
                        <Text>
                          {moment(event?.end_date).format("LL [at] HH:mm")}
                        </Text>
                        {form2.errors.endDate && (
                          <Text c="red">
                            {form2.errors.endDate}
                          </Text>
                        )}
                      </>
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
                  </div>
                  <div>
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
                  </div>
                </Flex>
              </form>
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
                        <IconCopy size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconUserQuestion size={14} />}
                        color="pinkcolor.2"
                      >
                        <Anchor
                          target="_blank"
                          onClick={() => {
                            guestClipboard.copy(
                              `${
                                import.meta.env.VITE_BASE_ENDPOINTMENT
                              }guests/access/event/${eventId}`
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
                          c="pinkcolor.2"
                        >
                          Link for guest
                        </Anchor>
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconUserShare size={14} />}
                        color="deepredcolor.9"
                      >
                        <Anchor
                          target="_blank"
                          onClick={() => {
                            presenterClipboard.copy(
                              `${
                                import.meta.env.VITE_BASE_ENDPOINTMENT
                              }presenters/${eventId}`
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
                          c="deepredcolor.9"
                        >
                          Link for presenter
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

        <Tabs
          radius="xs"
          color="redcolor.4"
          defaultValue="gallery"
          w="80%"
          mx="auto"
          h="max-content"
        >
          <Tabs.List mb="2rem">
            <Tabs.Tab
              value="gallery"
              leftSection={<IconInfoSquare size={14} />}
            >
              Event Infomation
            </Tabs.Tab>
            <Tabs.Tab
              value="messages"
              leftSection={<IconPresentationAnalytics size={14} />}
            >
              Projects ({totalProjects})
            </Tabs.Tab>
            <Tabs.Tab
              value="settings"
              leftSection={<IconChartBar size={14} />}
              disabled
            >
              Result
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="gallery">
            <UpdateThumbnail />
            <Card className={styles.cardContainer} mx="auto">
              <Grid>
                <Grid.Col span={4}>
                  <Grid>
                    <Grid.Col span={4}>
                      <Text c="redcolor.4">Event Presenter</Text>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <form onSubmit={form3.onSubmit(() => updateEvent())}>
                        <div>
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
                              <Text>
                                {moment(event?.submit_start).format(
                                  "LL [at] HH:mm"
                                )}
                              </Text>
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
                                {/* {moment(event?.submit_end).format("MMMM D, YYYY HH:mm")} */}
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
                                <Text>
                                  {moment(event?.submit_end).format(
                                    "LL [at] HH:mm"
                                  )}
                                </Text>
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
                        </div>
                      </form>
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
                                value={virtualMoneyForm?.values.virtualMoney}
                                required
                                onChange={(e) => {
                                  //  console.log("e", e.target.value);
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
                  <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
                </Grid.Col>

                <Grid.Col mb="md">
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

          <Tabs.Panel value="messages" mt="3rem">
            <Box w="100%" mx="auto">
              <Flex justify="space-between" align="flex-start">
                <Button
                  size="sm"
                  leftSection={<IconSquarePlus size={14} />}
                  onClick={toggleAddProject}
                >
                  <Text c="pinkcolor.1" size="small">
                    Add Project
                  </Text>
                </Button>
                <Modal
                  title="Create New Project"
                  opened={addProjectOpened}
                  onClose={toggleAddProject}
                  centered
                  size="80%"
                >
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
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search project"
                  rightSection={<IconSearch size={14} />}
                  w="50%"
                />
                <Select
                  ml="md"
                  data={["5", "10", "15", "20"]}
                  value={pageSize.toString()}
                  onChange={(e) => {
                    // console.log("e", e);
                    if (e !== null) {
                      setPageSize(parseInt(e));
                    }
                  }}
                />
              </Flex>

              <div style={{ height: "100vh", marginTop: "2rem" }}>
                {projects ? (
                  <div>
                    {projects.map((project: ProjectType) => (
                      <Card
                        key={project.id}
                        className={styles.cardContainer}
                        p="lg"
                        mt="1rem"
                      >
                        <Grid align="flex-start" gutter="2rem">
                          <Grid.Col span={2}>
                            <Text size="xsmall" c="graycolor.2">
                              Project name
                            </Text>
                            <Text size="base" fw={500}>
                              {project.title}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span="auto">
                            <Text size="xsmall" c="graycolor.2">
                              Description
                            </Text>
                            <ModalProject project={project} />
                          </Grid.Col>

                          <Grid.Col span="content" ta="end">
                            <Text size="sm" c="redcolor.4">
                              {project.virtual_money} {event?.unit_money}
                            </Text>
                            <Text size="small" c="graycolor.2">
                              {moment(project?.created_at).format(
                                "LL [at] HH:mm A"
                              )}
                            </Text>
                          </Grid.Col>
                        </Grid>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div>
                    <Text size="md" my="md" fw={500}>
                      No Projects
                    </Text>
                  </div>
                )}

                <Center mt="md">
                  <Pagination.Root
                    color="redcolor.4"
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
              </div>
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
        </Tabs>

        <div className={styles.footer}></div>
      </div>

      {/* <div className={styles.footer}></div> */}

      {/* red footer */}
      {/* <Affix className={styles.footer}></Affix> */}
    </body>
  );
}
