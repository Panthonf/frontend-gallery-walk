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
  Card,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { isNotEmpty } from "@mantine/form";
import { DatePickerInput, TimeInput } from "@mantine/dates";
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
import { IconArrowRight, IconClock } from "@tabler/icons-react";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import Swal from "sweetalert2";

import styles from "../styles.module.css";

import Navbar from "../components/navbar";
import moment from "moment";

document.title = `Create Event | Event Manager`;

export default function CreateEvent() {
  const [activeNavbarIndex] = useState(1);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINTMENT;
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <img
        key={index}
        src={imageUrl}
        alt="preview"
        style={{ width: rem(450) }}
      />
    );
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
          `${moment(form.values.startDateEvent).format("YYYY-MM-DD")} ${
            form.values.startTimeEvent
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
          `${moment(form.values.startDateProject).format("YYYY-MM-DD")} ${
            form.values.startTimeProject
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
        `${moment(values.startDateEvent).format("YYYY-MM-DD")} ${
          values.startTimeEvent
        }`,
        "YYYY-MM-DD HH:mm"
      ).toISOString(),
      endDateTimeEvent: moment(
        `${moment(values.endDateEvent).format("YYYY-MM-DD")} ${
          values.endTimeEvent
        }`,
        "YYYY-MM-DD HH:mm"
      ).toISOString(),

      startDateTimeProject: moment(
        `${moment(values.startDateProject).format("YYYY-MM-DD")} ${
          values.startTimeProject
        }`,
        "YYYY-MM-DD HH:mm"
      ).toISOString(),
      endDateTimeProject: moment(
        `${moment(values.endDateProject).format("YYYY-MM-DD")} ${
          values.endTimeProject
        }`,
        "YYYY-MM-DD HH:mm"
      ).toISOString(),
    }),
  });

  const onSubmit = async () => {
    const formData = form.values;
    // console.log("formData", formData);
    // console.log("trans formed values", form.getTransformedValues());
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
              `${BASE_ENDPOINT}events`,
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
      color="gray"
      onClick={() => refstartevent.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerEndEvent = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refendevent.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerStartProject = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refstartproject.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerEndProject = (
    <ActionIcon
      variant="subtle"
      color="gray"
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

  return (
    <body
      style={{
        display: "flex",
      }}
    >
      {/* navbar */}
      <Navbar activeIndex={activeNavbarIndex} />

      <Center
        style={{
          height: "max-content",
          width: "100vw",
          padding: "3rem",
        }}
      >
        <div>
          {/* register container */}
          <Stepper active={active} onStepClick={setActive}>
            <Stepper.Step label="First step" description="General Information">
              <div>
                <form
                  onSubmit={form.onSubmit(onSubmit)}
                  style={{
                    height: "100%",
                    width: "calc(100vw - 25rem)",
                    margin: "3rem 0 0 0",
                  }}
                >
                  <div
                    className={styles.boxContainer}
                    style={{
                      borderRight: "1rem solid var(--redcolor)",
                    }}
                  >
                    <Grid>
                      <Grid.Col span={12}>
                        <Text fw={600} c="redcolor.4" size="md">
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
                      <Grid.Col span={4}>
                        <DatePickerInput
                          label="Start Date"
                          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                          placeholder="Start Date"
                          withAsterisk
                          {...form.getInputProps("startDateEvent")}
                        />
                      </Grid.Col>
                      <Grid.Col span={2}>
                        <TimeInput
                          label="Start Time"
                          description="Lorem ipsum dolor sit amet"
                          ref={refstartevent}
                          rightSection={pickerStartEvent}
                          withAsterisk
                          {...form.getInputProps("startTimeEvent")}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <DatePickerInput
                          label="End Date"
                          placeholder="End Date"
                          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                          withAsterisk
                          {...form.getInputProps("endDateEvent")}
                        />
                      </Grid.Col>
                      <Grid.Col span={2}>
                        <TimeInput
                          label="End Time"
                          description="Lorem ipsum dolor sit amet"
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
                    </Grid>
                  </div>

                  <Grid
                    className={styles.boxContainer}
                    style={{
                      borderRight: "1rem solid var(--deepredcolor)",
                    }}
                  >
                    <Grid.Col span={12}>
                      <Text fw={600} c="deepredcolor.9" size="md">
                        Presenter Details
                      </Text>
                      <Text size="sm" c="graycolor.2">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </Text>
                    </Grid.Col>

                    <Grid.Col span={4}>
                      <DatePickerInput
                        label="Start Date"
                        defaultValue={new Date()}
                        placeholder="Start Date"
                        required
                        {...form.getInputProps("startDateProject")}
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>
                      <TimeInput
                        label="Start Time"
                        ref={refstartproject}
                        rightSection={pickerStartProject}
                        required
                        {...form.getInputProps("startTimeProject")}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <DatePickerInput
                        label="End Date"
                        placeholder="End Date"
                        required
                        {...form.getInputProps("endDateProject")}
                      />
                    </Grid.Col>
                    <Grid.Col span={2}>
                      <TimeInput
                        label="End Time"
                        ref={refendproject}
                        rightSection={pickerEndProject}
                        required
                        {...form.getInputProps("endTimeProject")}
                      />
                    </Grid.Col>
                  </Grid>

                  <Grid
                    className={styles.boxContainer}
                    style={{
                      borderRight: "1rem solid var(--pinkcolor)",
                    }}
                  >
                    <Grid.Col span={12}>
                      <Text fw={600} c="pinkcolor.2" size="md">
                        Guest Details
                      </Text>
                    </Grid.Col>
                    <Grid.Col>
                      <Radio.Group
                        name="favoriteFramework"
                        label="Select virtual money"
                        description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                        value={selectedFramework}
                        onChange={(value) =>
                          handleFrameworkChange(value as string)
                        }
                      >
                        <Group mt="xs" gap="3rem">
                          <div>
                            <Flex align="center">
                              <Radio
                                icon={CheckIcon}
                                size="xs"
                                color="redcolor.4"
                                mr="md"
                                value="default"
                              />
                              <Text>Default virtual money</Text>
                            </Flex>

                            <Text size="small" ml="xl" c="graycolor.2">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit.
                            </Text>
                          </div>

                          <div>
                            <Flex align="center">
                              <Radio
                                icon={CheckIcon}
                                size="xs"
                                color="redcolor.4"
                                mr="md"
                                value="custom"
                              />
                              <Text>Customize virtual money</Text>
                            </Flex>

                            <Text size="small" ml="xl" c="graycolor.2">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit.
                            </Text>
                          </div>
                        </Group>
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
                  {/* <Group justify="flex-end" mt="xl">
                                        <Button type="submit" mt="sm">
                                            Submit
                                        </Button>
                                    </Group> */}
                </form>
              </div>
            </Stepper.Step>
            {/*  image dropzone */}
            <Stepper.Step
              label="Second step"
              description="Images Dropzone"
            >
              <Card shadow="sm" padding="md" radius="md">
                <Dropzone
                  onDrop={(files) => {
                    console.log("dropped files", files), setFiles(files);
                  }}
                  onReject={(files) => console.log("rejected files", files)}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                  >
                    <Dropzone.Accept>
                      <IconUpload
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-blue-6)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-red-6)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconPhoto
                        style={{
                          width: rem(52),
                          height: rem(52),
                          color: "var(--mantine-color-dimmed)",
                        }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>

                    <div>
                      {previews.length > 0 ? (
                        <>
                          <Text size="xl" inline>
                            Change images here or click to select files
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7}>
                            file should not exceed 5mb
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text size="xl" inline>
                            Drag images here or click to select files
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should
                            not exceed 5mb
                          </Text>
                        </>
                      )}
                    </div>
                  </Group>
                </Dropzone>

                {/*  preview */}
                <Center>
                  <Flex
                    gap="md"
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                  >
                    {previews.length > 0 && (
                      <Text size="xl" fw={700}>
                        Preview
                      </Text>
                    )}
                    {previews}
                    {previews.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setFiles([])}
                        style={{ width: rem(450) }}
                      >
                        Remove
                      </Button>
                    )}
                  </Flex>
                </Center>
              </Card>

              {/* <Group justify="center" mt="md">
                <Button onClick={() => openRef.current?.()}>
                  Select files
                </Button>
              </Group> */}
            </Stepper.Step>
            <Stepper.Step
              label="Final step"
              description="Check all information before submit"
            >
              <Card shadow="sm" padding="md" radius="md">
                <Text fw={600} c="redcolor.4" size="md">
                  Event Manager Details
                </Text>
                <Divider mt="xs" mb="lg" />

                <Text size="sm">
                  Event Name: {form.values.eventName.toString()}
                </Text>
                <Text size="sm">
                  Start Date:{" "}
                  {moment(form.values.startDateEvent).format("DD/MM/YYYY")}{" "}
                  {moment(form.values.startTimeEvent, "HH:mm").format(
                    "hh:mm A"
                  )}
                </Text>
                <Text size="sm">
                  End Date:{" "}
                  {moment(form.values.endDateEvent).format("DD/MM/YYYY")}{" "}
                  {moment(form.values.endTimeEvent, "HH:mm").format("hh:mm A")}
                </Text>

                <Text size="sm">
                  Description:
                  <div
                    dangerouslySetInnerHTML={{
                      __html: form.values.description.toString(),
                    }}
                  />
                </Text>
              </Card>
              <Card mt="lg" shadow="sm" padding="md" radius="md">
                <Text fw={600} c="redcolor.4" size="md">
                  Presenter Details
                </Text>
                <Divider mt="xs" mb="lg" />
                <Text size="sm">
                  Submit Start Date:{" "}
                  {moment(form.values.startDateProject).format("DD/MM/YYYY")}{" "}
                  {moment(form.values.startTimeProject, "HH:mm").format(
                    "hh:mm A"
                  )}
                </Text>
                <Text size="sm">
                  Submit End Date:{" "}
                  {moment(form.values.endDateProject).format("DD/MM/YYYY")}{" "}
                  {moment(form.values.endTimeProject, "HH:mm").format(
                    "hh:mm A"
                  )}
                </Text>
              </Card>
              <Card mt="lg" shadow="sm" padding="md" radius="md">
                <Text fw={600} c="redcolor.4" size="md">
                  Guest Details
                </Text>
                <Divider mt="xs" mb="lg" />
                <Text size="sm">Virtual Money: {form.values.virtualMoney}</Text>
                <Text size="sm">Unit: {form.values.unit}</Text>
              </Card>
            </Stepper.Step>
          </Stepper>
          <Group justify="flex-end" mt="xl">
            {active !== 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
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
                color="indigo"
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
