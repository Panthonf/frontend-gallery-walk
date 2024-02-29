import {
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
  Divider,
  Loader,
  Center,
  ActionIcon,
  Pagination,
  // Image,
  // Avatar,
} from "@mantine/core";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingIndicator } from "../components/loading";
import {
  IconArrowLeft,
  IconArrowsDiagonal,
  IconCoin,
  IconSend,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import Swal from "sweetalert2";

export default function GuestProject({ projectId }: { projectId: number }) {
  // const { projectId } = useParams();
  const [projectData, setProjectData] = useState<projectType>();
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [
    descriptionOpened,
    { open: openDescription, close: closeDescription },
  ] = useDisclosure(false);
  const [visible, toggle] = useDisclosure(false);
  const [guestData, setGuestData] = useState<GuestType>({
    profile_pic: "",
    last_name_en: "",
    first_name_en: "",
    virtual_money: 0,
    id: 0,
  });

  const [commentData, setCommentData] = useState<object[]>([]);
  const [pageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const navigate = useNavigate();
  const { eventId } = useParams();

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

  async function fetchProjectComments() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_ENDPOINTMENT
        }guests/get-project-comments?projectId=${projectId}`,
        {
          withCredentials: true,
          params: { page, pageSize },
        }
      );

      if (response.data.success === true) {
        // console.log("comments", response.data);
        setCommentData(response.data.data);
        setTotalComments(response.data.totalComments);
      } else {
        // console.log("comments", response.data);
      }
    } catch (err) {
      // console.log("err ggg", err);
    }
  }
  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/isLoggedIn`,
          {
            withCredentials: true,
          }
        );
        if (response.data.authenticated === false) {
          window.location.href = `${
            import.meta.env.VITE_FRONTEND_ENDPOINT
          }/guest/login`;
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    isLoggedIn();
    async function fetchProjectData() {
      const response = await axios
        .get(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }projects/get-data/${projectId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success === true) {
            setProjectData(res.data.data);
            setIsLoading(false);
            setIsCommentsLoading(false);
            document.title = res.data.data.title;
          } else {
            navigate(-1);
          }
        })
        .catch(() => {
          // console.log("err", err);
        });
      return response;
    }

    async function fetchProjectComments() {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }guests/get-project-comments?projectId=${projectId}`,
          {
            withCredentials: true,
            params: { page, pageSize },
          }
        );
        if (response.data.success === true) {
          // console.log("comments", response.data);
          setCommentData(response.data.data);
          setTotalComments(response.data.totalComments);
        } else {
          // console.log("comments", response.data);
        }
      } catch (err) {
        // console.log("err ggg", err);
      }
    }

    fetchProjectData();
    fetchGuestData();
    fetchProjectComments();
  }, [navigate, page, pageSize, projectId]);

  async function fetchGuestData() {
    await axios
      .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/get-guest-data`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success === true) {
          // console.log("guest data", res.data.data);
          setGuestData(res.data.data);
          setIsLoading(false);
          setIsCommentsLoading(false);
        }
      })
      .catch(() => {
        // console.log("err", err);
      });
  }

  async function giveVirtualMoney() {
    toggle.open();
    await axios
      .post(
        `${
          import.meta.env.VITE_BASE_ENDPOINTMENT
        }guests/give-virtual-money?projectId=${projectId}&guestId=${
          guestData?.id
        }&eventId=${eventId}`,
        {
          amount: form.values.amount,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `Virtual money given ${form.values.amount}`,
            timer: 1000,
            showConfirmButton: false,
          });
          close();
          toggle.close();
          setIsLoading(false);
          fetchGuestData();
          form.reset();
        } else {
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
      .catch(() => {});
  }

  async function addComment() {
    setIsCommentsLoading(true);
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
          // console.log("add comment", res.data);
          fetchProjectComments();
          // Swal.fire({
          //   icon: "success",
          //   title: "Success",
          //   text: `Comment added`,
          //   timer: 1000,
          //   showConfirmButton: false,
          // });
          setIsCommentsLoading(false);
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
      .catch(() => {
        // console.log("add comment err", err);
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
    event_id: string;
  };
  type GuestType = {
    profile_pic: string;
    last_name_en: string;
    first_name_en: string;
    virtual_money: number;
    id: number;
  };

  // if (isLoading) {
  //   return <LoadingIndicator />;
  // }

  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
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
              {/* <Flex mb="lg" justify="space-between" align="center">
                <Text size="md" c="dimmed">
                  {guestData.first_name_en} {guestData.last_name_en}
                </Text>
                {guestData.profile_pic ? (
                  <Image
                    src={guestData.profile_pic}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    radius="xl"
                  />
                ) : (
                  <Avatar size={50} radius="xl" />
                )}
              </Flex>
              <Divider mb="lg" /> */}
              <Title c="red.6">{projectData?.title}</Title>
              <Text mt="md" size="small" c="dimmed">
                Description
              </Text>
              {/* <Flex justify="center" align="center" gap="xl"> */}
              <Divider mb="sm" />
              {/* <Card shadow="xs" mt="xs" pb="xs"> */}
              <Text lineClamp={4}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: projectData?.description?.toString() || "",
                  }}
                ></div>
              </Text>
              {(projectData?.description?.length ?? 0) > 200 ? (
                <Flex justify="flex-end">
                  <ActionIcon
                    variant="subtle"
                    onClick={openDescription}
                    color="red.4"
                  >
                    <IconArrowsDiagonal size={14} stroke={1.5} />
                  </ActionIcon>
                </Flex>
              ) : null}
              {/* </Card> */}

              <Modal
                opened={descriptionOpened}
                onClose={closeDescription}
                title="Description"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: projectData?.description.toString() || "",
                  }}
                ></div>
              </Modal>
              {/* </Flex> */}
              <Flex justify="space-between" mt="md" align="center" gap="xl">
                <Text size="small" c="dimmed">
                  {moment(projectData?.created_at).format(
                    "D MMMM YYYY HH:mm A"
                  )}
                </Text>
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
                  radius="md"
                  variant="filled"
                  size="xs"
                  leftSection={<IconCoin />}
                  onClick={open}
                  // variant="default"
                  color="red.5"
                >
                  Give Virtual Money
                </Button>
              </Flex>

              <Divider my="md" />

              <Title mx="md" c="red.5" order={4}>
                Comments
              </Title>
              <form
                onSubmit={commentForm.onSubmit(() => {
                  addComment(), commentForm.reset();
                })}
              >
                <Flex
                  mx="md"
                  justify="left"
                  align="center"
                  style={{ marginTop: 16 }}
                >
                  <TextInput
                    placeholder="Comment"
                    mr="sm"
                    {...commentForm.getInputProps("comment")}
                    w="fit-content"
                  />
                  {/* {commentForm.values.comment.length} */}
                  <Button
                    // variant="default"
                    w="fit-content"
                    color="red.5"
                    size="s"
                    type="submit"
                    rightSection={<IconSend></IconSend>}
                  >
                    Send
                  </Button>
                </Flex>
              </form>
              {commentData.length > 0 ? (
                <>
                  {isCommentsLoading ? (
                    <Center>
                      <Loader mt="lg" color="blue" />
                    </Center>
                  ) : (
                    <>
                      {commentData.map((comment: object) => (
                        <Text
                          mx="md"
                          mt="md"
                          key={(comment as { id: string }).id}
                        >
                          {/* <Divider mt="4" /> */}
                          <Flex justify="space-between" align="center">
                            <Text mt="xs" size="xs" c="gray">
                              {moment(
                                (comment as { created_at: string }).created_at
                              ).format("D MMMM YYYY HH:mm A")}{" "}
                            </Text>
                            <Text mt="xs" size="xs" c="gray">
                              {moment(
                                (comment as { created_at: string }).created_at
                              ).fromNow()}
                            </Text>
                          </Flex>
                          <Text
                            style={{
                              overflowWrap: "break-word",
                            }}

                            // mb="sm"
                          >
                            {(comment as { comment: string }).comment}
                          </Text>
                          <Divider mt="4" />
                        </Text>
                      ))}
                      <Center mt="xs">
                        <Pagination
                          color="red.5"
                          size="sm"
                          mt="md"
                          total={Math.ceil(totalComments / pageSize)}
                          boundaries={2}
                          value={page}
                          onChange={(newPage) => setPage(newPage)}
                        />
                      </Center>
                    </>
                  )}
                </>
              ) : (
                // </ScrollArea>
                <Text mx="md" mt="md">
                  No comments
                </Text>
              )}
            </Card>{" "}
            {/* <Anchor underline="always" onClick={() => navigate(-1)}>
              Back
            </Anchor> */}
            {/* <Anchor mb="md" underline="always" onClick={() => navigate(-1)}>
              Back
            </Anchor>  */}
            {/* <Button
              // radius="lg"
              variant="filled"
              color="red"
              size="s"
              leftSection={<IconArrowLeft />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button> */}
          </Flex>
        </div>
      )}
    </>
  );
}
