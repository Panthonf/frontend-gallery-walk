import {
  Card,
  Title,
  Text,
  Flex,
  Divider,
  Button,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import { useForm } from "@mantine/form";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { IconEdit } from "@tabler/icons-react";

type ProjectType = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  event_id: string;
};

type EventType = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  event_id: string;
  end_date: string;
  unit_money: string;
};

type CommentType = {
  id: string;
  comment: string;
  created_at: string;
};

export default function Projects() {
  const projectId = useParams<{ projectId: string }>().projectId;
  const [project, setProject] = useState<ProjectType | null>();
  const [editMode, setEditMode] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [event, setEvent] = useState<EventType>();
  const [virtualMoney, setVirtualMoney] = useState<number>(0);
  const [comment, setComment] = useState<CommentType | null>();

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
            console.log("project data", res.data.data);
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
            setComment(res.data.data);
          });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProjectComment();
  }, [project?.event_id, projectId]);

  const form = useForm({
    initialValues: {
      title: project?.title,
    },
  });

  const form2 = useForm({
    initialValues: {
      description: project?.description,
    },
  });

  const content = project?.description || "";
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
      form2.setFieldValue("description", editor.getHTML());
    },
  });

  const handleEdit = () => {
    if (editMode) {
      // If in edit mode, reset the form values
      if (project?.title) {
        form?.setFieldValue("title", project.title);
      }
    } else {
      // Set the initial values for the input fields
      form?.setFieldValue("title", project?.title);
    }
    setEditMode(!editMode);
  };

  const handleEditDescription = () => {
    editor?.commands.setContent(project?.description || "");
    if (editDescription) {
      // If in edit mode, reset the form values
      editor?.commands.setContent(project?.description || "");
    }
    setEditDescription(!editDescription);
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
          console.log("update project", res.data);
          setProject(res.data.data);
          setEditMode(false);
        });
    } catch (error) {
      console.error("Error fetching project:", error);
    }
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
        .then((res) => {
          console.log("update project description", res.data);
          setProject(res.data.data);
          setEditDescription(false);
        });
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  return (
    <>
      {project && project !== null ? (
        <div>
          <Card shadow="lg" mt="lg" style={{ margin: "auto", width: "70%" }}>
            <Title order={2} c="pink.6">
              <form
                onSubmit={form.onSubmit((values) => {
                  updateProjectTitle(values);
                })}
              >
                {editMode ? (
                  <TextInput
                    {...form.getInputProps("title")}
                    label="Title"
                    placeholder="Project title"
                    required
                    error={form.errors.title && "Title is required"}
                  />
                ) : (
                  <Flex justify="space-between">
                    <Title order={3} c="pink.6">
                      {project?.title}{" "}
                      <Button
                        rightSection={<IconEdit></IconEdit>}
                        onClick={handleEdit}
                        variant="white"
                        size="xs"
                        // mt="md"
                      />
                    </Title>
                    <Text mt="xs" c="gray">
                      Created at:{" "}
                      {moment(project?.created_at).format("MMM D [at] h:mma")}
                    </Text>
                  </Flex>
                )}

                {editMode ? (
                  <Button
                    // rightSection={<IconCircleX></IconCircleX>}
                    onClick={handleEdit}
                    variant="white"
                    size="xs"
                    mt="md"
                  >
                    Cancel
                  </Button>
                ) : // <Button
                //   rightSection={<IconEdit></IconEdit>}
                //   onClick={handleEdit}
                //   variant="white"
                //   size="xs"
                //   // mt="md"
                // />
                null}

                {editMode && (
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
              </form>
            </Title>
            <Divider mt="sm" />
            <Text mt="md">
              <form
                onSubmit={form2.onSubmit((values) => {
                  console.log("values", values);
                  updateProjectDescription(values);
                })}
              >
                {editDescription ? (
                  <div>
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
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(project?.description),
                    }}
                  />
                )}

                {editDescription ? (
                  <Button
                    // rightSection={<IconCircleX></IconCircleX>}
                    onClick={handleEditDescription}
                    variant="white"
                    size="xs"
                    mt="md"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    leftSection={<IconEdit></IconEdit>}
                    onClick={handleEditDescription}
                    variant="light"
                    size="xs"
                    mt="xs"
                  >
                    Edit
                  </Button>
                )}

                {editDescription && (
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
              </form>
            </Text>

            <Divider mt="md" />

            <Flex justify="space-between" mt="md">
              <Button
                size="sm"
                variant="white"
                p="xs"
                onClick={() => {
                  window.history.back();
                }}
                leftSection="←"
              >
                Back
              </Button>
              {/* <Button
              size="sm"
              variant="white"
              p="xs"
              onClick={open}
              leftSection="✎"
            >
              Edit
            </Button> */}
            </Flex>
          </Card>
          <Card shadow="lg" mt="lg" style={{ margin: "auto", width: "70%" }}>
            <Title order={5} c="gray.6">
              <Title order={3} c="gray.6">
                Feedbacks
              </Title>
              {/* <Text c="pink.5">Feedback is available now! </Text> */}
              {/* {moment(event?.end_date).format("DD/MM/YYYY HH:mma")}{" "} */}
              <Card shadow="lg" mt="lg" style={{ margin: "auto" }}>
                <Title order={4} c="gray.6">
                  Virtual Money
                </Title>
                <Divider mb="md" />
                {moment(event?.end_date).isBefore(moment()) ? (
                  <>
                    {/* <Text c="pink.5">
                      Feedbacks are available now! You have earned{" "}
                    </Text> */}
                    <Text c="pink" fw={700} size="xl">
                      {virtualMoney} {event?.unit_money}
                    </Text>
                  </>
                ) : (
                  <>
                    <Flex justify={"space-between"}>
                      <Text c="pink.5">
                        Feedbacks will be available after the event ends on{" "}
                        {moment(event?.end_date).format("DD/MM/YYYY HH:mma")}{" "}
                      </Text>
                      <Text c="red.6" size="xs" fw="bolder">
                        {moment(event?.end_date).endOf("hour").fromNow()}
                      </Text>
                    </Flex>
                  </>
                )}
              </Card>
              <Card shadow="lg" mt="lg" style={{ margin: "auto" }}>
                <Title order={4} c="gray.6">
                  Comments
                </Title>
                <Divider mb="md" />
                {Array.isArray(comment) && comment.length !== 0 ? (
                  comment.map((comment: CommentType) => (
                    <Card shadow="lg" mt="lg">
                      {/* {comment} */}
                      <Text c="dark.5">{comment.comment}</Text>
                      <Text c="red.6" size="xs" fw="bolder" mt="xs">
                        {moment(comment.created_at).fromNow()}
                      </Text>
                    </Card>
                  ))
                ) : (
                  <Text c="pink.5">No comments yet!</Text>
                )}
              </Card>
            </Title>
          </Card>
        </div>
      ) : null}
    </>
  );
}
