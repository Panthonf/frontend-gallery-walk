import {
  Anchor,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  Text,
  Title,
  NumberInput,
  LoadingOverlay,
  TextInput,
  ScrollArea,
  Divider,
} from "@mantine/core";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingIndicator } from "../components/loading";
import { IconCoin, IconSend } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import Swal from "sweetalert2";

export default function GuestProject() {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState<projectType>();
  const [isLoading, setIsLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [visible, toggle] = useDisclosure(false);
  const [guestData, setGuestData] = useState<GuestType>({
    virtual_money: 0,
    id: 0,
  });

  const [commentData, setCommentData] = useState<object[]>([]);
  const viewport = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      amount: Number(0),
    },

    validate: {
      amount: (value) =>
        value <= 0
          ? "Amount must be greater than 0"
          : value > guestData?.virtual_money
            ? "Amount must be less than your virtual money"
            : null,
    },
  });

  const commentForm = useForm({
    initialValues: {
      comment: "",
    },
    validate: {
      comment: (value) => {
        if (value.length < 0) {
          return "Comment must be greater than 0";
        } else if (value.length > 100) {
          return "Comment must be less than 100";
        }
      },
    },
  });

  useEffect(() => {
    async function fetchProjectData() {
      const response = await axios
        .get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT
          }projects/get-data/${projectId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success === true) {
            console.log(res.data.data);
            setProjectData(res.data.data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
      return response;
    }

    async function fetchProjectComments() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT
          }guests/get-project-comments?projectId=${projectId}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success === true) {
          console.log("comments", response.data);
          setCommentData(response.data.data);
        } else {
          console.log("comments", response.data);
        }
      } catch (err) {
        console.log("err ggg", err);
      }
    }

    fetchProjectData();
    fetchGuestData();
    fetchProjectComments();
  }, [navigate, projectId]);

  async function fetchGuestData() {
    await axios
      .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/get-guest-data`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success === true) {
          console.log("guest data", res.data.data);
          setGuestData(res.data.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("err", err);
        // navigate("-1")
      });
  }

  async function giveVirtualMoney() {
    toggle.open();
    await axios
      .post(
        `${import.meta.env.VITE_BASE_ENDPOINTMENT
        }guests/give-virtual-money?projectId=${projectId}&guestId=${guestData?.id
        }`,
        {
          amount: form.values.amount,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          console.log("give virtual money", res.data.data);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Virtual money given ${form.values.amount}`,
          });
          close();
          toggle.close();
          setIsLoading(false);
          fetchGuestData();
        } else {
          console.log("give virtual money", res.data);
          setIsLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          close();
          toggle.close();
        }
      })
      .catch((err) => {
        console.log("give virtual money err", err);
        console.log("virtual money", form.values.amount);
      });
  }

  async function addComment() {
    await axios
      .post(
        `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/add-comment`,
        {
          comment: commentForm.values.comment,
          projectId: projectId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          console.log("add comment", res.data);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Comment added`,
            timer: 1000,
            showConfirmButton: false,
          });
          setIsLoading(false);
          window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            timer: 1000,
            showConfirmButton: false,
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("add comment err", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          timer: 1000,
          showConfirmButton: false,
        });
      });
  }

  type projectType = {
    id: string;
    title: string;
    description: string;
    created_at: string;
  };
  type GuestType = {
    virtual_money: number;
    id: number;
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      {projectData ? (
        <div>
          <Flex
            mih={50}
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            m="lg"
          >
            <Card radius="md" shadow="lg" maw={600}>
              {/* <Text fs="normal" fz="lg">
              Event id: {eventId}
            </Text>
            <Text fs="normal" fz="lg">
              Project id: {projectId}
            </Text> */}
              <Title>{projectData?.title}</Title>
              <Divider mb="lg" />
              <Text>
                <div dangerouslySetInnerHTML={{
                  __html: projectData.description.toString() || "",
                }}></div>
              </Text>
              <Flex justify="space-between" mt="md" align="center">
                <Badge>
                  {moment(projectData?.created_at).format("DD/MM/yyyy HH:mm:ss a")}
                </Badge>

                <Modal
                  opened={opened}
                  onClose={close}
                  title="Give Virtual Money"
                >
                  <LoadingOverlay
                    visible={visible}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2 }}
                    loaderProps={{ color: "pink", type: "bars" }}
                  />
                  <Text>You have {guestData?.virtual_money}</Text>

                  <form onSubmit={form.onSubmit(() => giveVirtualMoney())}>
                    <NumberInput
                      mt="md"
                      label="Virtual Money"
                      placeholder="Enter amount"
                      {...form.getInputProps("amount")}
                    />

                    <Group justify="flex-end" mt="md">
                      <Button type="submit">Submit</Button>
                    </Group>
                  </form>
                </Modal>
                <Button
                  radius="lg"
                  variant="filled"
                  color="red"
                  size="xs"
                  leftSection={<IconCoin />}
                  onClick={open}
                >
                  Give Virtual Money
                </Button>
              </Flex>
            </Card>{" "}
            {/* <Anchor underline="always" onClick={() => navigate(-1)}>
              Back
            </Anchor> */}
            <Card radius="md" shadow="lg" miw={200} maw={600}>
              <Title order={4}>Comments</Title>

              {commentData.length > 0 ? (
                <ScrollArea h={200} viewportRef={viewport}>
                  {commentData.map((comment: object) => (
                    <Card mt="sm" key={(comment as { id: string }).id}>
                      <Text>{(comment as { comment: string }).comment}</Text>
                      <Text size="md" c="gray" mt="sm">
                        {/* {moment(
                          (comment as { created_at: string }).created_at
                        ).format("MMMM Do YY HH:mm a")} */}

                        {moment((comment as { created_at: string }).created_at)
                          .startOf("hour")
                          .fromNow()}
                      </Text>
                    </Card>
                  ))}
                </ScrollArea>
              ) : (
                <Text>No comments</Text>
              )}
              <form
                onSubmit={commentForm.onSubmit(() => {
                  console.log("comment", commentForm.values.comment),
                    addComment();
                })}
              >
                <Divider mt="md" mb="md" />
                <Flex justify="center" align="center" style={{ marginTop: 16 }}>
                  <TextInput
                    placeholder="Comment"
                    mr="sm"
                    {...commentForm.getInputProps("comment")}
                  />
                  <Button
                    variant="default"
                    color="blue"
                    size="xs"
                    rightSection={<IconSend></IconSend>}
                    type="submit"
                  >
                    Send
                  </Button>
                </Flex>
              </form>
            </Card>
            <Anchor mb="md" underline="always" onClick={() => navigate(-1)}>
              Back
            </Anchor>
          </Flex>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
