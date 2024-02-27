import {
    Button,
    Flex,
    Group,
    Text,
    NumberInput,
    TextInput,
    Divider,
    Loader,
    Center,
    Pagination,
    Paper,
    // Image,
    // Avatar,
} from "@mantine/core";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    IconCoins,
    IconSend,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import Swal from "sweetalert2";

export default function GuestProject() {
    const { projectId } = useParams();
    const [ projectData, setProjectData] = useState<projectType>();
    const [ isLoading, setIsLoading] = useState(true);
    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);

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
                `${import.meta.env.VITE_BASE_ENDPOINTMENT
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
                    window.location.href = `${import.meta.env.VITE_FRONTEND_ENDPOINT
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
                    `${import.meta.env.VITE_BASE_ENDPOINTMENT
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
                    `${import.meta.env.VITE_BASE_ENDPOINTMENT
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
                `${import.meta.env.VITE_BASE_ENDPOINTMENT
                }guests/give-virtual-money?projectId=${projectId}&guestId=${guestData?.id
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
            .catch(() => { });
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

    return (
        <>
            <Paper
                withBorder
                p="md"
                radius="md"
                bg="none"
                h="max-content"
            >
                <Group justify="space-between">
                    <Text c="graycolor.2">You have</Text>
                    <IconCoins size={16} />
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text fw={500} c="greencolor.4">
                        {guestData?.virtual_money}
                    </Text>
                </Group>

                <Text fz="xs" c="dimmed" mt={7}>
                    Your Virtual Money
                </Text>
            </Paper>
            <form onSubmit={form.onSubmit(() => giveVirtualMoney())}>
                <NumberInput
                    mt="md"
                    label="Virtual Money"
                    placeholder="Enter amount"
                    {...form.getInputProps("amount")}
                />
                <Group justify="flex-end" mt="md">
                    <Button type="submit" color="greencolor.4">Submit</Button>
                </Group>
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
                <TextInput
                    placeholder="Comment"
                    {...commentForm.getInputProps("comment")}
                />

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
        </>
    );
}
