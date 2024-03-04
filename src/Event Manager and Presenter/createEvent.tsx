import { useState, useRef } from "react";
import axios from "axios";
// import "@mantine/core/styles.css";
import {
    Center,
    Button,
    Stepper,
    Group,
    Flex,
    Grid,
    Text,
    Radio,
    CheckIcon,
    TextInput,
    ActionIcon,
    rem,
    Divider,
    Box,
    Indicator,
    Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { isNotEmpty } from "@mantine/form";
import { Calendar, DatePickerInput, TimeInput } from "@mantine/dates";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";

import "@mantine/tiptap/styles.css";
import {
    IconArrowLeft,
    IconArrowRight,
    IconArrowsDiagonal,
    IconClock,
    IconClockHour3,
    IconPhotoUp,
    IconPhotoX,
    // IconMapPin,
} from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import Swal from "sweetalert2";

import styles from "../styles.module.css";

import Navbar from "../components/navbar";
import moment from "moment";
import { useDisclosure } from "@mantine/hooks";

document.title = `Create Event | Event Manager`;

export default function CreateEvent() {
    // const [activeNavbarIndex] = useState(1);
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINTMENT;

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <img key={index} src={imageUrl} alt="preview" width="55%" />;
    });

    // step controller
    const [active, setActive] = useState(0);
    const nextStep = () =>
        setActive((current) => {
            if (form.validate().hasErrors) {
                return current;
            }
            return current < 3 ? current + 1 : current;
        });

    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    const changeStep = (step: number) => {
        if (form.validate().hasErrors) {
            return;
        }
        setActive(step);
    };

    const form = useForm({
        initialValues: {
            eventName: String,
            startDateEvent: new Date(),
            startTimeEvent: null,
            endDateEvent: null,
            endTimeEvent: null,
            startDateProject: new Date(),
            startTimeProject: null,
            endDateProject: null,
            endTimeProject: null,
            description: "",
            virtualMoney: 10000,
            unit: "Unit",
            location: "",
        },

        validate: {
            eventName: (value) =>
                value.length < 2 ? "Event name is too short" : null,
            startDateEvent: (value) => {
                if (!value) {
                    return "Enter your start date event";
                }

                const isAfterOrEqual = moment(value).isSameOrAfter(
                    moment().format("YYYY-MM-DD")
                );

                if (!isAfterOrEqual) {
                    console.log("value start", value);
                    return "Start date must be after or equal to today";
                }

                return null;
            },
            endDateEvent: (value) => {
                if (!value) {
                    return "Enter your end date event";
                }

                const startDateEvent = moment(form.values.startDateEvent).format(
                    "YYYY-MM-DD"
                );
                const endDateEvent = moment(value).format("YYYY-MM-DD");
                const isAfterOrEqual =
                    moment(endDateEvent).isSameOrAfter(startDateEvent);

                if (!isAfterOrEqual) {
                    return "End date must be after or equal to start date";
                }

                return null;
            },

            startTimeEvent: (value) => {
                if (!value) {
                    return "Enter your start time event";
                }

                const startTimeEvent = moment(value).format("HH:mm");
                const endTimeEvent = moment(form.values.endTimeEvent).format("HH:mm");

                const isAfterOrEqual = startTimeEvent >= endTimeEvent;

                if (!isAfterOrEqual) {
                    return "Start time must be after or equal to today";
                }
                return null;
            },
            endTimeEvent: (value) => {
                if (!value) {
                    return "Enter your end time event";
                }

                const startDateTimeEvent = moment(
                    `${moment(form.values.startDateEvent).format("YYYY-MM-DD")} ${form.values.startTimeEvent
                    }`,
                    "YYYY-MM-DD HH:mm"
                ).toISOString();

                const endDateTimeEvent = moment(
                    `${moment(form.values.endDateEvent).format("YYYY-MM-DD")} ${value}`,
                    "YYYY-MM-DD HH:mm"
                ).toISOString();

                const isAfterOrEqual =
                    moment(endDateTimeEvent).isSameOrAfter(startDateTimeEvent);

                if (!isAfterOrEqual) {
                    return "Start time must be after start time";
                }
                return null;
            },
            startDateProject: isNotEmpty("Enter your submit start date"),
            endDateProject: (value) => {
                if (!value) {
                    return "Enter your submit end date";
                }

                const isAfterOrEqual = moment(value).isSameOrAfter(
                    moment(form.values.startDateProject).format("YYYY-MM-DD")
                );

                if (!isAfterOrEqual) {
                    return "End date must be after or equal to submit start date";
                }

                return null;
            },
            startTimeProject: isNotEmpty("Enter your submit start time"),
            endTimeProject: (value) => {
                if (!value) {
                    return "Enter your submit end time";
                }

                const startDateTimeProject = moment(
                    `${moment(form.values.startDateProject).format("YYYY-MM-DD")} ${form.values.startTimeProject
                    }`,
                    "YYYY-MM-DD HH:mm"
                ).toISOString();

                const endDateTimeProject = moment(
                    `${moment(form.values.endDateProject).format("YYYY-MM-DD")} ${value}`,
                    "YYYY-MM-DD HH:mm"
                ).toISOString();

                const isAfterOrEqual =
                    moment(endDateTimeProject).isSameOrAfter(startDateTimeProject);

                if (!isAfterOrEqual) {
                    return "Start time must be after submit start time";
                }
                return null;
            },
            virtualMoney: (value) => {
                if (!value) {
                    return "Enter your virtual money";
                }
                const isNumber = /^\d+$/.test(value.toString());
                if (!isNumber) {
                    return "Virtual money must be a number";
                }
                return null;
            },

            unit: isNotEmpty("Enter your unit"),
        },

        transformValues: (values) => ({
            startDateTimeEvent: moment(
                `${moment(values.startDateEvent).format("YYYY-MM-DD")} ${values.startTimeEvent
                }`,
                "YYYY-MM-DD HH:mm"
            ).toISOString(),
            endDateTimeEvent: moment(
                `${moment(values.endDateEvent).format("YYYY-MM-DD")} ${values.endTimeEvent
                }`,
                "YYYY-MM-DD HH:mm"
            ).toISOString(),

            startDateTimeProject: moment(
                `${moment(values.startDateProject).format("YYYY-MM-DD")} ${values.startTimeProject
                }`,
                "YYYY-MM-DD HH:mm"
            ).toISOString(),
            endDateTimeProject: moment(
                `${moment(values.endDateProject).format("YYYY-MM-DD")} ${values.endTimeProject
                }`,
                "YYYY-MM-DD HH:mm"
            ).toISOString(),
        }),
    });

    const onSubmit = async () => {
        const formData = form.values;
        console.log("form data", formData);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes, create it!",
            cancelButtonText: "No, cancel!",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios
                        .post(
                            `${import.meta.env.VITE_BASE_ENDPOINTMENT}events`,
                            {
                                event_name: formData.eventName,
                                start_date: form.getTransformedValues().startDateTimeEvent,
                                end_date: form.getTransformedValues().endDateTimeEvent,
                                submit_start: form.getTransformedValues().startDateTimeProject,
                                submit_end: form.getTransformedValues().endDateTimeProject,
                                virtual_money: formData.virtualMoney,
                                unit_money: formData.unit,
                                description: formData.description,
                                number_of_member: 10,
                                location: formData.location,
                            },
                            {
                                withCredentials: true,
                            }
                        )
                        .then(async (res) => {
                            const thumbnailUploaded = await uploadThumbnail(
                                res.data.data.id
                            ).then((res) => {
                                return res;
                            });

                            if (!(thumbnailUploaded === true)) {
                                Swal.fire({
                                    title: "Error!",
                                    text: "Error uploading thumbnail.",
                                    icon: "error",
                                    confirmButtonText: "OK",
                                });
                            } else {
                                Swal.fire({
                                    title: "Created!",
                                    text: "Your event has been created.",
                                    icon: "success",
                                    confirmButtonText: "OK",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        window.location.href = "/dashboard";
                                    }
                                });
                            }
                        })
                        .catch((err) => {
                            console.log("err", err);
                        });
                } catch (error) {
                    console.error("Error fetching events:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "Error creating event please try again.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
        });
    };

    const uploadThumbnail = async (eventId: number) => {
        const selectedFile = files[0];
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            if (selectedFile) {
                await axios.post(
                    `${BASE_ENDPOINT}events/upload/thumbnail/${eventId}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                );
                return true;
            }
            return true;
        } catch (error) {
            // console.error("Error uploading thumbnail:", error);
            return false;
        }
    };

    const [selectedFramework, setSelectedFramework] = useState("default");

    const handleFrameworkChange = (value: string) => {
        setSelectedFramework(value);
    };

    const isCustomFrameworkSelected = selectedFramework === "custom";

    // Timepicker
    const refstartevent = useRef<HTMLInputElement>(null);
    const refendevent = useRef<HTMLInputElement>(null);
    const refstartproject = useRef<HTMLInputElement>(null);
    const refendproject = useRef<HTMLInputElement>(null);

    const pickerStartEvent = (
        <ActionIcon
            variant="subtle"
            color="graycolor.4"
            onClick={() => refstartevent.current?.showPicker()}
        >
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const pickerEndEvent = (
        <ActionIcon
            variant="subtle"
            color="graycolor.4"
            onClick={() => refendevent.current?.showPicker()}
        >
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const pickerStartProject = (
        <ActionIcon
            variant="subtle"
            color="graycolor.4"
            onClick={() => refstartproject.current?.showPicker()}
        >
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const pickerEndProject = (
        <ActionIcon
            variant="subtle"
            color="graycolor.4"
            onClick={() => refendproject.current?.showPicker()}
        >
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder: "Description" }),
        ],
        onUpdate() {
            if (editor) {
                form.setFieldValue("description", editor.getHTML());
            }
        },
    });

    const openRef = useRef<() => void>(null);

    const [opened, { open, close }] = useDisclosure(false);

    return (
        <body>
            {/* navbar */}
            <Navbar />

            <Center
                style={{
                    height: "max-content",
                    width: "90%",
                    padding: "3rem",
                    margin: "auto"
                }}
            >
                <div>
                    {/* register container */}
                    <Stepper
                        active={active}
                        onStepClick={changeStep}
                        color="redcolor.4"
                        size="sm"
                        iconSize={32}
                    >
                        <Stepper.Step label="First step" description="General Information">
                            <div
                                style={{
                                    height: "100%",
                                    width: "90%",
                                    margin: "3rem auto auto auto",
                                }}
                            >
                                <form onSubmit={form.onSubmit(onSubmit)}>
                                    <div
                                        className={styles.boxContainer}
                                        style={{
                                            borderRight: "1rem solid var(--redcolor)",
                                        }}
                                    >
                                        <Grid>
                                            <Grid.Col span={12}>
                                                <Text fw={500} c="redcolor.4" size="md">
                                                    Event Manager Details
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={12}>
                                                <TextInput
                                                    label="Event Name"
                                                    placeholder="Event Name"
                                                    withAsterisk
                                                    {...form.getInputProps("eventName")}
                                                />
                                            </Grid.Col>

                                            <Grid.Col span={{ sm: 8, lg: 4 }}>
                                                <DatePickerInput
                                                    label="Start Date"
                                                    description="for event"
                                                    placeholder="Start Date"
                                                    withAsterisk
                                                    {...form.getInputProps("startDateEvent")}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={{ sm: 4, lg: 2 }}>
                                                <TimeInput
                                                    label="Start Time"
                                                    description="for event"
                                                    ref={refstartevent}
                                                    rightSection={pickerStartEvent}
                                                    withAsterisk
                                                    {...form.getInputProps("startTimeEvent")}
                                                />
                                            </Grid.Col>

                                            <Grid.Col span={{ sm: 8, lg: 4 }}>
                                                <DatePickerInput
                                                    label="End Date"
                                                    placeholder="End Date"
                                                    description="for event"
                                                    withAsterisk
                                                    {...form.getInputProps("endDateEvent")}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={{ sm: 4, lg: 2 }}>
                                                <TimeInput
                                                    label="End Time"
                                                    description="for event"
                                                    ref={refendevent}
                                                    rightSection={pickerEndEvent}
                                                    withAsterisk
                                                    {...form.getInputProps("endTimeEvent")}
                                                />
                                            </Grid.Col>
                                            <Grid.Col>
                                                <Text fw={500} c="#000000" mb="1rem">
                                                    Description
                                                </Text>
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
                                                    <RichTextEditor.Content
                                                        {...form.getInputProps("description")}
                                                    />
                                                </RichTextEditor>
                                            </Grid.Col>

                                            <Grid.Col span={12}>
                                                <TextInput
                                                    label="Location"
                                                    placeholder="Location"
                                                    {...form.getInputProps("location")}
                                                />

                                            </Grid.Col>
                                        </Grid>
                                    </div>

                                    <Grid
                                        className={styles.boxContainer}
                                        style={{
                                            borderRight: "1rem solid var(--bluecolor)",
                                        }}
                                    >
                                        <Grid.Col span={12}>
                                            <Text fw={500} c="bluecolor.4" size="md">
                                                Presenter Details
                                            </Text>
                                        </Grid.Col>

                                        <Grid.Col span={{ sm: 8, lg: 4 }}>
                                            <DatePickerInput
                                                label="Start date"
                                                defaultValue={new Date()}
                                                description="for presenter"
                                                placeholder="Start date"
                                                required
                                                {...form.getInputProps("startDateProject")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ sm: 4, lg: 2 }}>
                                            <TimeInput
                                                label="Start time"
                                                description="for presenter"
                                                ref={refstartproject}
                                                rightSection={pickerStartProject}
                                                required
                                                {...form.getInputProps("startTimeProject")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ sm: 8, lg: 4 }}>
                                            <DatePickerInput
                                                label="End date"
                                                description="for presenter"
                                                placeholder="End submission"
                                                required
                                                {...form.getInputProps("endDateProject")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={{ sm: 4, lg: 2 }}>
                                            <TimeInput
                                                label="End time"
                                                ref={refendproject}
                                                description="for presenter"
                                                rightSection={pickerEndProject}
                                                required
                                                {...form.getInputProps("endTimeProject")}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Grid
                                        className={styles.boxContainer}
                                        style={{
                                            borderRight: "1rem solid var(--greencolor)",
                                        }}
                                    >
                                        <Grid.Col span={12}>
                                            <Text fw={500} c="greencolor.4" size="md">
                                                Guest Details
                                            </Text>
                                        </Grid.Col>
                                        <Grid.Col>
                                            <Radio.Group
                                                name="favoriteFramework"
                                                label="Select virtual money"
                                                description="Virtual money is event platform offers virtual support for projects"
                                                value={selectedFramework}
                                                onChange={(value) =>
                                                    handleFrameworkChange(value as string)
                                                }
                                            >
                                                <Box mt="md">
                                                    <Flex align="center">
                                                        <Radio
                                                            icon={CheckIcon}
                                                            size="xs"
                                                            color="greencolor.4"
                                                            mr="md"
                                                            value="default"
                                                        />
                                                        <Text>Default virtual money</Text>
                                                    </Flex>

                                                    <Text size="small" ml="xl" c="graycolor.2">
                                                        The default money is 10,000 Unit
                                                    </Text>
                                                </Box>

                                                <Box mt="md">
                                                    <Flex align="center">
                                                        <Radio
                                                            icon={CheckIcon}
                                                            size="xs"
                                                            color="greencolor.4"
                                                            mr="md"
                                                            value="custom"
                                                        />
                                                        <Text>Customize virtual money.</Text>
                                                    </Flex>

                                                    <Text size="small" ml="xl" c="graycolor.2">
                                                        Can customize by your own.
                                                    </Text>
                                                </Box>
                                            </Radio.Group>
                                        </Grid.Col>
                                        <Grid.Col span={8}>
                                            {isCustomFrameworkSelected && (
                                                <TextInput
                                                    label="Virtual money"
                                                    placeholder="Virtual money"
                                                    required
                                                    {...form.getInputProps("virtualMoney")}
                                                />
                                            )}
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            {isCustomFrameworkSelected && (
                                                <TextInput
                                                    label="Unit"
                                                    placeholder="Unit"
                                                    required
                                                    {...form.getInputProps("unit")}
                                                />
                                            )}
                                        </Grid.Col>
                                    </Grid>
                                </form>
                            </div>
                        </Stepper.Step>

                        {/*  image dropzone */}
                        <Stepper.Step label="Second step" description="Images Dropzone">
                            <div
                                style={{
                                    height: "100%",
                                    width: "84vw",
                                    margin: "3rem auto auto auto",
                                }}
                            >
                                <Dropzone
                                    accept={IMAGE_MIME_TYPE}
                                    maxFiles={1}
                                    maxSize={5000000} // 5mb
                                    onDrop={(files) => {
                                        console.log("dropped files", files[0]), setFiles(files);
                                    }}
                                    onReject={(files) => {
                                        console.log("rejected files", files);
                                        if (files.length > 1) {
                                            Swal.fire({
                                                title: "Error!",
                                                text: "You can only upload 1 file",
                                                icon: "error",
                                                confirmButtonText: "OK",
                                            });
                                        } else {
                                            Swal.fire({
                                                title: "Error!",
                                                text: "Image should not exceed 5mb",
                                                icon: "error",
                                                confirmButtonText: "OK",
                                            });
                                        }
                                    }}
                                    className={styles.dropzoneContainer}
                                >
                                    <div>
                                        {previews.length > 0 ? (
                                            <Center h="55vh" ta="center">
                                                <div>
                                                    <Text
                                                        size="base"
                                                        c="redcolor.4"
                                                        fw={500}
                                                        mb="md"
                                                    >
                                                        Preview
                                                    </Text>

                                                    <div style={{ position: "relative" }}>
                                                        {previews}

                                                        <ActionIcon
                                                            variant="filled"
                                                            radius="xl"
                                                            aria-label="Settings"
                                                            style={{
                                                                position: "absolute",
                                                                right: "5rem",
                                                                top: "-0.5rem",
                                                            }}
                                                            color="redcolor.4"
                                                            onClick={() => setFiles([])}
                                                        >
                                                            <IconPhotoX size={14} />
                                                        </ActionIcon>
                                                    </div>


                                                </div>
                                            </Center>
                                        ) : (
                                            <Center h="55vh" m="auto" ta="center">
                                                <div>
                                                    <Text c="redcolor.4">
                                                        <IconPhotoUp size={36} stroke={1.5} />
                                                    </Text>
                                                    <Text size="base" inline>
                                                        Drag image here or click to select file
                                                    </Text>
                                                    <Text c="graycolor.2" inline mt="1rem">
                                                        Lorem ipsum dolor sit amet consectetur
                                                        adipisicing elit. Dolorem aliquam aspernatur est
                                                        harum.
                                                    </Text>
                                                </div>
                                            </Center>
                                        )}
                                    </div>

                                    <Center>
                                        <Button
                                            size="sm"
                                            radius="xs"
                                            w="50%"
                                            style={{ position: "absolute", bottom: "-1.25rem" }}
                                            onClick={() => openRef.current?.()}
                                        >
                                            Select files
                                        </Button>
                                    </Center>
                                </Dropzone>
                            </div>
                        </Stepper.Step>

                        {/* preview step */}
                        <Stepper.Step
                            label="Final step"
                            description="Check all information before submit"
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    margin: "3rem auto auto auto",
                                }}
                            >
                                <Grid
                                    className={styles.boxContainer}
                                    style={{
                                        borderRight: "1rem solid var(--redcolor)",
                                    }}

                                >
                                    <Grid.Col span="content">
                                        <Calendar
                                            minDate={form.getInputProps("startDateEvent").value}
                                            maxDate={form.getInputProps("endDateEvent").value}
                                            static
                                            renderDay={(date) => {
                                                const startDate =
                                                    form.getInputProps("startDateEvent").value;
                                                const endDate =
                                                    form.getInputProps("endDateEvent").value;

                                                const isInRange =
                                                    startDate &&
                                                    endDate &&
                                                    date >= startDate &&
                                                    date <= endDate;

                                                return (
                                                    <Indicator
                                                        size={6}
                                                        color={isInRange ? "redcolor.4" : "transparent"}
                                                        offset={-2}
                                                    >
                                                        <div>{date.getDate()}</div>
                                                    </Indicator>
                                                );
                                            }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span="auto">
                                        <Text fw={500} c="redcolor.4" size="topic">
                                            Event Manager Details
                                        </Text>

                                        <Divider mt="xs" mb="lg" />

                                        <Text mb="xs">
                                            <Text span fw={500} mr="sm">
                                                Event Name:{" "}
                                            </Text>
                                            {form.values.eventName.toString()}
                                        </Text>

                                        <Grid>
                                            <Grid.Col span={6}>
                                                <Text size="xsmall" c="graycolor.4">
                                                    Start event
                                                </Text>
                                                <Text c="redcolor.4">{moment(form.values.startDateEvent).format("LL")}</Text>

                                                <Flex align="center" gap="xs">
                                                    <IconClockHour3 size={14} />
                                                    {moment(form.values.startTimeEvent, "HH:mm").format(
                                                        "hh:mm A"
                                                    )}
                                                </Flex>
                                            </Grid.Col>

                                            <Grid.Col span={6}>
                                                <Text size="xsmall" c="graycolor.4">
                                                    End event
                                                </Text>
                                                <Text c="redcolor.4">{moment(form.values.endDateEvent).format("LL")}</Text>

                                                <Flex align="center" gap="xs">
                                                    <IconClockHour3 size={14} />
                                                    {moment(form.values.endTimeEvent, "HH:mm").format(
                                                        "hh:mm A"
                                                    )}
                                                </Flex>
                                            </Grid.Col>
                                        </Grid>

                                        {/* <Grid gutter="md" mt="xs">
                                            <Grid.Col>
                                                <Text span fw={500}>
                                                    Start event date:{" "}
                                                </Text>
                                                <Text span c="redcolor.4" mx="xs">
                                                    {moment(form.values.startDateEvent).format("LL")}
                                                </Text>
                                                {" at "}
                                                <Text span c="redcolor.4" mx="xs">
                                                    {moment(form.values.startTimeEvent, "HH:mm").format(
                                                        "hh:mm A"
                                                    )}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col>
                                                <Text span fw={500}>
                                                    End event date:{" "}
                                                </Text>
                                                <Text span c="redcolor.4" mx="xs">
                                                    {moment(form.values.endDateEvent).format("LL")}
                                                </Text>
                                                {" at "}
                                                <Text span c="redcolor.4" mx="xs">
                                                    {moment(form.values.endTimeEvent, "HH:mm").format(
                                                        "hh:mm A"
                                                    )}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>

                                        <div>
                                            <Text span fw={500}>
                                                Location:{" "}
                                            </Text>
                                            {form.values.location.toString()}
                                        </div> */}

                                        <Text fw={500} mb="0.3rem" mt="xs">
                                            Description
                                        </Text>
                                        <Flex align="flex-end">
                                            <Text
                                                lineClamp={5}
                                                dangerouslySetInnerHTML={{
                                                    __html: form.values.description.toString(),
                                                }}
                                            ></Text>
                                            <ActionIcon
                                                variant="subtle"
                                                onClick={open}
                                                color="redcolor.4"
                                            >
                                                <IconArrowsDiagonal size={14} stroke={1.5} />
                                            </ActionIcon>
                                        </Flex>

                                        <Modal
                                            opened={opened}
                                            onClose={close}
                                            title="Description"
                                            centered
                                            radius="xs"
                                            size="75%"
                                            padding="lg"
                                            className={styles.scrollBar}
                                        >
                                            <Text
                                                dangerouslySetInnerHTML={{
                                                    __html: form.values.description.toString(),
                                                }}
                                            />
                                        </Modal>
                                    </Grid.Col>
                                </Grid>

                                <Flex justify="space-between">
                                    <Grid
                                        className={styles.boxContainer}
                                        style={{
                                            borderRight: "1rem solid var(--deepredcolor)",
                                        }}
                                        columns={12}
                                    // align="center"
                                    >
                                        <Grid.Col span="content">
                                            <Calendar
                                                minDate={form.getInputProps("startDateProject").value}
                                                maxDate={form.getInputProps("endDateProject").value}
                                                static
                                                renderDay={(date) => {
                                                    const startDate =
                                                        form.getInputProps("startDateProject").value;
                                                    const endDate =
                                                        form.getInputProps("endDateProject").value;
                                                    const isInRange =
                                                        startDate &&
                                                        endDate &&
                                                        date >= startDate &&
                                                        date <= endDate;
                                                    return (
                                                        <Indicator
                                                            size={6}
                                                            color={
                                                                isInRange ? "deepredcolor.9" : "transparent"
                                                            }
                                                            offset={-2}
                                                        >
                                                            <div>{date.getDate()}</div>
                                                        </Indicator>
                                                    );
                                                }}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span="auto">
                                            <Text fw={500} c="deepredcolor.9" size="md">
                                                Event Presenter Details
                                            </Text>
                                            <Text size="sm" c="graycolor.2">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing
                                                elit.
                                            </Text>
                                            <Divider mt="xs" mb="lg" />
                                            <Text mb="xs">
                                                <div>
                                                    <Text span fw={500}>
                                                        Start submit date:{" "}
                                                    </Text>
                                                    <Text span c="deepredcolor.4" mx="xs">
                                                        {moment(form.values.startDateEvent).format("LL")}
                                                    </Text>
                                                    {" at "}
                                                    <Text span c="deepredcolor.4" mx="xs">
                                                        {moment(form.values.startTimeEvent, "HH:mm").format(
                                                            "hh:mm A"
                                                        )}
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text span fw={500}>
                                                        End submit date:{" "}
                                                    </Text>
                                                    <Text span c="deepredcolor.4" mx="xs">
                                                        {moment(form.values.endDateProject).format("LL")}
                                                    </Text>
                                                    {" at "}
                                                    <Text span c="deepredcolor.4" mx="xs">
                                                        {moment(form.values.endTimeProject, "HH:mm").format(
                                                            "hh:mm A"
                                                        )}
                                                    </Text>
                                                </div>
                                            </Text>
                                        </Grid.Col>
                                    </Grid>

                                    <Grid
                                        className={styles.boxContainer}
                                        style={{
                                            borderRight: "1rem solid var(--pinkcolor)",
                                        }}
                                    // align="center"
                                    >
                                        <Grid.Col span={12}>
                                            <Text fw={500} c="pinkcolor.2" size="md">
                                                Guest Details
                                            </Text>
                                            <Text size="sm" c="graycolor.2">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing
                                                elit.
                                            </Text>
                                            <Divider mt="xs" mb="lg" />
                                            <Text mb="xs">
                                                <div>
                                                    <Text span fw={500}>
                                                        Virtual money:{" "}
                                                    </Text>
                                                    <Text span c="pinkcolor.2" mx="xs">
                                                        {form.values.virtualMoney}
                                                    </Text>
                                                    {" Unit "}
                                                    <Text span c="pinkcolor.2" mx="xs">
                                                        {form.values.unit}
                                                    </Text>
                                                </div>
                                            </Text>
                                        </Grid.Col>
                                    </Grid>
                                </Flex>
                            </div>
                        </Stepper.Step>
                    </Stepper>

                    <Group justify="flex-end" mt="xl">
                        <div style={{ justifySelf: "flex-start" }}>
                            {active !== 0 && (
                                <Button
                                    variant="default"
                                    onClick={prevStep}
                                    size="sm"
                                    leftSection={<IconArrowLeft size={14} />}
                                >
                                    Back
                                </Button>
                            )}
                        </div>
                        {active !== 2 && (
                            <Button
                                onClick={nextStep}
                                size="sm"
                                rightSection={<IconArrowRight size={14} />}
                            >
                                Next step
                            </Button>
                        )}
                        {active === 2 && (
                            <Button
                                onClick={() => {
                                    onSubmit();
                                }}
                                size="sm"
                            >
                                Submit
                            </Button>
                        )}
                    </Group>
                </div>
            </Center>
        </body>
    );
}
