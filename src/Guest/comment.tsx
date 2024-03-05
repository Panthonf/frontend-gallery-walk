import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Textarea,
  Text,
  Button,
  Group,
  Center,
  Pagination,
  Loader,
  ScrollArea,
  Divider,
  Flex,
  LoadingOverlay,
} from "@mantine/core";
import { IconMessagePlus } from "@tabler/icons-react";
import moment from "moment";

export default function Comment({ projectId }: { projectId: number }) {
  const [commentData, setCommentData] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(1);
  const [
    pageSize,
    // setPageSize
  ] = useState(5);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(true);

  const commentForm = useForm({
    initialValues: {
      commentLike: "",
      commentBetter: "",
      commentIdea: "",
    },
  });

  useEffect(() => {
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
          setIsModalLoading(false);
          setIsCommentsLoading(false);
        }
        setIsModalLoading(false);
        setIsCommentsLoading(false);
      } catch (err) {
        // console.log("err ggg", err);
        setIsModalLoading(false);
        setIsCommentsLoading(false);
      }
    }
    if (projectId) {
      fetchProjectComments();
    }
  }, [projectId, page, pageSize]);

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
        setIsModalLoading(false);
      }
      setIsModalLoading(false);
    } catch (err) {
      setIsModalLoading(false);
    }
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

  return (
    <div>
      {isModalLoading ? (
        <LoadingOverlay
          visible={isModalLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "greencolor.4", type: "dots" }}
        />
      ) : (
        <>
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
                color="greencolor.4"
                size="sm"
                type="submit"
                rightSection={<IconMessagePlus size={14} />}
              >
                Send
              </Button>
            </Group>
          </form>

          {commentData.length > 0 ? (
            <>
              {isCommentsLoading ? (
                <Center>
                  <Loader my="lg" color="greencolor.4" />
                </Center>
              ) : (
                <>
                  {commentData.map((comment: object) => (
                    <Text mx="md" mt="md" key={(comment as { id: string }).id}>
                      {(
                        (comment as { comment_like: string }).comment_like || ""
                      ).length < 1 &&
                      (
                        (comment as { comment_better: string })
                          .comment_better || ""
                      ).length < 1 &&
                      ((comment as { comment_idea: string }).comment_idea || "")
                        .length < 1 ? (
                        ""
                      ) : (
                        <>
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

                          <ScrollArea mt="sm">
                            {(comment as { comment_like: string }).comment_like
                              .length < 1 ? (
                              ""
                            ) : (
                              <>
                                <Text size="xs" c="dimmed">
                                  What i like about this project?
                                </Text>
                                {
                                  (comment as { comment_like: string })
                                    .comment_like
                                }
                              </>
                            )}

                            {(comment as { comment_better: string })
                              .comment_better.length < 1 ? (
                              ""
                            ) : (
                              <>
                                <Text size="xs" c="dimmed">
                                  What could make this project better?
                                </Text>
                                {
                                  (comment as { comment_better: string })
                                    .comment_better
                                }
                              </>
                            )}

                            {(comment as { comment_idea: string }).comment_idea
                              .length < 1 ? (
                              ""
                            ) : (
                              <>
                                <Text size="xs" c="dimmed">
                                  New idea or suggestion for this project?
                                </Text>{" "}
                                {
                                  (comment as { comment_idea: string })
                                    .comment_idea
                                }
                              </>
                            )}
                          </ScrollArea>
                          <Divider mt="4" />
                        </>
                      )}
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
            <Center>
              <Text mx="md" mt="md" c="gray">
                No comments yet
              </Text>
            </Center>
          )}
        </>
      )}
    </div>
  );
}
