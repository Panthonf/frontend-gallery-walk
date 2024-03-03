import {
  Button,
  Flex,
  Group,
  Text,
  NumberInput,
  //   TextInput,
  Divider,
  Loader,
  Center,
  Pagination,
  Paper,
  Textarea,
  ScrollArea,
  // Image,
  // Avatar,
} from "@mantine/core";
import axios from "axios";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconCoins, IconSend } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import Swal from "sweetalert2";

export default function GuestProject({ projectId }: { projectId: number }) {
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
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
  const [alreadyGivenVirtualMoney, setAlreadyGivenVirtualMoney] = useState({
    amount: 0,
  });
  const [isGivenLoading, setIsGivenLoading] = useState(true);
  const [isGuestDataLoading, setIsGuestDataLoading] = useState(true);

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
      commentLike: "",
      commentBetter: "",
      commentIdea: "",
    },
    validate: {
      commentLike: isNotEmpty("This field is required"),
      commentBetter: isNotEmpty("This field is required"),
      commentIdea: isNotEmpty("This field is required"),
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
        console.log("comments", response.data);
        setCommentData(response.data.data);
        setTotalComments(response.data.totalComments);
      }
    } catch (err) {
      // console.log("err ggg", err);
    }
  }

  useEffect(() => {
    const fetchAlreadyGive = () => {
      axios
        .get(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }guests/get-already-given-virtual-money?projectId=${projectId}&guestId=${
            guestData.id
          }&eventId=${eventId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success === true) {
            setAlreadyGivenVirtualMoney(res.data.data);
            setIsGivenLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error during fetchAlreadyGiven:", error);
          setIsGivenLoading(false);
          // Handle error gracefully, show a message to the user, or retry
        });
    };
    fetchAlreadyGive();
  }, [eventId, guestData.id, projectId]);

  const fetchAlreadyGive = () => {
    axios
      .get(
        `${
          import.meta.env.VITE_BASE_ENDPOINTMENT
        }guests/get-already-given-virtual-money?projectId=${projectId}&guestId=${
          guestData.id
        }&eventId=${eventId}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          setAlreadyGivenVirtualMoney(res.data.data);
        }
      })
      .catch(() => {
        // console.error("Error during fetchAlreadyGiven:", error);
      });
  };

  const fetchGuestData = useCallback(async () => {
    await axios
      .get(`${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/get-guest-data`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success === true) {
          setGuestData(res.data.data);
          setIsGuestDataLoading(false);
          setIsCommentsLoading(false);
        }
        setIsGuestDataLoading(false);
      })
      .catch(() => {});
  }, []);

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
      } catch {
        // console.log("err ggg", err);
      }
    }
    fetchGuestData();
    fetchProjectComments();
  }, [fetchGuestData, navigate, page, pageSize, projectId]);

  async function giveVirtualMoney() {
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
          //   setIsLoading(false);
          fetchGuestData();
          fetchAlreadyGive();
          form.reset();
        } else {
          //   setIsLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
          close();
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
          comment_like: commentForm.values.commentLike,
          comment_better: commentForm.values.commentBetter,
          comment_idea: commentForm.values.commentIdea,
          projectId: projectId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success === true) {
          fetchProjectComments();
          setIsCommentsLoading(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            timer: 1000,
            showConfirmButton: false,
          });
          //   setIsLoading(false);
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

  type GuestType = {
    profile_pic: string;
    last_name_en: string;
    first_name_en: string;
    virtual_money: number;
    id: number;
  };

  return (
    <>
      <Paper withBorder p="md" radius="md" bg="none" h="max-content">
        <Group justify="space-between">
          <Text c="graycolor.2">You have</Text>
          <IconCoins size={16} />
        </Group>

        <Flex justify="space-between" align="baseline" gap="xs">
          <Text fz="50" fw={500} c="greencolor.4">
            {isGuestDataLoading ? (
              <Loader color="greencolor.4" size={14} />
            ) : (
              guestData.virtual_money.toLocaleString()
            )}
          </Text>

          <Text fz="md" c="dimmed">
            {isGivenLoading ? (
              <>
                <Flex align="center" gap="xs">
                  <Loader color="greencolor.4" size={14} />
                </Flex>
              </>
            ) : (
              <>{alreadyGivenVirtualMoney.amount.toLocaleString()} given</>
            )}{" "}
          </Text>
        </Flex>

        <Text fz="xs" c="dimmed" mt={7}>
          Your Virtual Money
        </Text>
      </Paper>
      <form onSubmit={form.onSubmit(() => giveVirtualMoney())}>
        <Text size="md" c="greencolor.4" mt="md">
          Give Virtual Money
        </Text>
        <Flex
          gap="xl"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <NumberInput
            // label="Virtual Money"
            placeholder="Enter amount"
            defaultValue={0}
            thousandSeparator=","
            {...form.getInputProps("amount")}
          />

          <Button type="submit" color="greencolor.4">
            <IconSend size={14} />
          </Button>
        </Flex>
      </form>

      <Divider my="md" />

      <Text size="md" c="greencolor.4">
        Comments
      </Text>

      <form
        onSubmit={commentForm.onSubmit(() => {
          addComment(), commentForm.reset();
        })}
      >
        <Text size="xs" c="dimmed" mt="xs">
          What i like about this project?
        </Text>
        <Textarea {...commentForm.getInputProps("commentLike")} />

        <Text size="xs" c="dimmed" mt="xs">
          What could make this project better?
        </Text>
        <Textarea {...commentForm.getInputProps("commentBetter")} />

        <Text size="xs" c="dimmed" mt="xs">
          New idea or suggestion for this project?
        </Text>
        <Textarea {...commentForm.getInputProps("commentIdea")} />

        <Group justify="flex-end" mt="md">
          <Button
            w="fit-content"
            color="greencolor.4"
            size="sm"
            type="submit"
            rightSection={<IconSend size={14} />}
          >
            Send
          </Button>
        </Group>
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
                <Text mx="md" mt="md" key={(comment as { id: string }).id}>
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

                  <ScrollArea mt="sm" h={200}>
                    <Text size="xs" c="dimmed">
                      What i like about this project?
                    </Text>
                    {(comment as { comment_like: string }).comment_like}

                    <Text size="xs" c="dimmed" mt="sm">
                      What could make this project better?
                    </Text>
                    {(comment as { comment_better: string }).comment_better}

                    <Text size="xs" c="dimmed" mt="sm">
                      New idea or suggestion for this project?
                    </Text>
                    {(comment as { comment_idea: string }).comment_idea}
                  </ScrollArea>
                  <Divider mt="4" />
                </Text>
              ))}
              <Center mt="xs">
                <Pagination
                  color="greencolor.4"
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
    </>
  );
}
