import { useState, useRef } from "react";
import axios from "axios";
// import "@mantine/core/styles.css";
import {
    Container,
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
    ActionIcon, rem, UnstyledButton
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { isNotEmpty } from "@mantine/form";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Placeholder from '@tiptap/extension-placeholder';

import '@mantine/tiptap/styles.css';
import { IconArrowRight, IconClock } from '@tabler/icons-react';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import styles from "../styles.module.css";


import Navbar from "../components/navbar";
import { getPackedSettings } from "http2";
import { time } from "console";

export default function CreateEvent(props: Partial<DropzoneProps>) {
    const [activeNavbarIndex] = useState(1);

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
            description: String,

            virtualMoney: 10000,
            unit: "Unit",
        },

        validate: {
            eventName: (value) =>
                value.length < 2 ? "Event name is too short" : null,
            endDateEvent: isNotEmpty("Enter your end date event"),
            endDateProject: isNotEmpty("Enter your end date project"),
            virtualMoney: isNotEmpty("Enter your virtual money"),
            unit: isNotEmpty("Enter your unit"),
        },

        transformValues: (values) => ({

            startDateTimeEvent: `${values.startDateEvent} ${values.startTimeEvent}`,
            endDateTimeEvent: `${values.endDateEvent} ${values.endTimeEvent}`,

            startDateTimeProject: `${values.startDateProject} ${values.startTimeProject}`,
            endDateTimeProject: `${values.endDateProject} ${values.endTimeEvent}`,
        }),
    });

    const onSubmit = async () => {
        const formData = form.values;
        console.log("ddd", formData);
        const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINTMENT;

        try {
            await axios
                .post(
                    `${BASE_ENDPOINT}events`,
                    {
                        event_name: formData.eventName,
                        start_date: formData.startDateTimeEvent(),
                        end_date: formData.endDateTimeEvent,
                        submit_start: formData.startDateTimeProject,
                        submit_end: formData.endDateTimeProject,
                        virtual_money: formData.virtualMoney,
                        unit_money: formData.unit,
                        description: formData.description,
                        number_of_member: 10,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then((res) => {
                    console.log(res.data);
                })
                .catch((err) => {
                    console.log("err", err);
                });
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const [selectedFramework, setSelectedFramework] = useState('default');

    const handleFrameworkChange = (value: string) => {
        setSelectedFramework(value);
    };

    const isCustomFrameworkSelected = selectedFramework === 'custom';

    // Timepicker
    const refstartevent = useRef<HTMLInputElement>(null);
    const refendevent = useRef<HTMLInputElement>(null);
    const refstartproject = useRef<HTMLInputElement>(null);
    const refendproject = useRef<HTMLInputElement>(null);

    const pickerStartEvent = (
        <ActionIcon variant="subtle" color="gray" onClick={() => refstartevent.current?.showPicker()}>
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const pickerEndEvent = (
        <ActionIcon variant="subtle" color="gray" onClick={() => refendevent.current?.showPicker()}>
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const pickerStartProject = (
        <ActionIcon variant="subtle" color="gray" onClick={() => refstartproject.current?.showPicker()}>
            <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const pickerEndProject = (
        <ActionIcon variant="subtle" color="gray" onClick={() => refendproject.current?.showPicker()}>
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
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: 'Description' })
        ],
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
                    padding: "3rem"
                }}
            >
                <div>
                    {/* register container */}
                    <Stepper active={active}>
                        <Stepper.Step label="First step" description="Profile settings">
                            <div>
                                <form
                                    onSubmit={form.onSubmit(onSubmit)}
                                    style={{
                                        height: "100%",
                                        width: "calc(100vw - 25rem)",
                                        margin: "3rem 0 0 0",

                                    }}
                                >
                                    <div className={styles.boxContainer}
                                        style={{
                                            borderRight: "1rem solid var(--redcolor)",
                                        }}>
                                        <Grid>
                                            <Grid.Col span={12}>
                                                <Text fw={600} c="redcolor.4" size="md">Event Manager Details</Text>
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
                                                    ref={refstartevent} rightSection={pickerStartEvent}
                                                    withAsterisk
                                                    {...form.getInputProps("startTimeEvent")} />
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
                                                    ref={refendevent} rightSection={pickerEndEvent}
                                                    withAsterisk
                                                    {...form.getInputProps("endTimeEvent")} />
                                            </Grid.Col>
                                            <Grid.Col>
                                                <Text fw={500} c="#000000" mb="1rem">Description</Text>
                                                <RichTextEditor editor={editor} m="0">
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
                                                    <RichTextEditor.Content {...form.getInputProps("description")} />
                                                </RichTextEditor>
                                            </Grid.Col>
                                        </Grid>
                                    </div>

                                    <Grid className={styles.boxContainer}
                                        style={{
                                            borderRight: "1rem solid var(--deepredcolor)",
                                        }}>
                                        <Grid.Col span={12}>
                                            <Text fw={600} c="deepredcolor.9" size="md">Presenter Details</Text>
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
                                                ref={refstartproject} rightSection={pickerStartProject}
                                                required
                                                {...form.getInputProps("startTimeProject")} />
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
                                                ref={refendproject} rightSection={pickerEndProject}
                                                required
                                                {...form.getInputProps("endTimeProject")} />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Text ta="center" my="auto">
                                                sjfksjdflsdjf
                                            </Text>
                                        </Grid.Col>
                                    </Grid>

                                    <Grid className={styles.boxContainer}
                                        style={{
                                            borderRight: "1rem solid var(--pinkcolor)",
                                        }}>
                                        <Grid.Col span={12}>
                                            <Text fw={600} c="pinkcolor.2" size="md">Guest Details</Text>
                                        </Grid.Col>
                                        <Grid.Col>
                                            <Radio.Group
                                                name="favoriteFramework"
                                                label="Select virtual money"
                                                description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
                                                value={selectedFramework}
                                                onChange={(value) => handleFrameworkChange(value as string)}
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

                                                        <Text size="small" ml="xl" c="graycolor.2">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
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

                                                        <Text size="small" ml="xl" c="graycolor.2">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>

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
                        <Stepper.Step
                            label="Second step"
                            description="Personal information"
                        >
                            <Dropzone
                                onDrop={(files) => console.log('accepted files', files)}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                {...props}
                            >
                                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                                    <Dropzone.Accept>
                                        <IconUpload
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Accept>
                                    <Dropzone.Reject>
                                        <IconX
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Reject>
                                    <Dropzone.Idle>
                                        <IconPhoto
                                            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Idle>

                                    <div>
                                        <Text size="xl" inline>
                                            Drag images here or click to select files
                                        </Text>
                                        <Text size="sm" c="dimmed" inline mt={7}>
                                            Attach as many files as you like, each file should not exceed 5mb
                                        </Text>
                                    </div>
                                </Group>
                            </Dropzone>
                        </Stepper.Step>
                        <Stepper.Step
                            label="Final step"
                            description="Social media"
                        ></Stepper.Step>
                        {/* <Stepper.Completed>
                                Completed! Form values:
                                <Code block mt="xl">
                                    {JSON.stringify(form.values, null, 2)}
                                </Code>
                            </Stepper.Completed> */}
                    </Stepper>
                    <Group justify="flex-end" mt="xl">
                        {active !== 0 && (
                            <Button variant="default" onClick={prevStep}>
                                Back
                            </Button>
                        )}
                        {active !== 3 && <Button
                            onClick={nextStep} size="sm" rightSection={<IconArrowRight size={14} />}>
                            Next step
                        </Button>}
                    </Group>
                </div>

                {/* <Stepper iconSize={37} active={active} onStepClick={setActive} allowNextStepsSelect={false} style={{
                        width: "calc(100vw - 25rem)",
                        height: "calc(100vh - 15rem)"
                    }}>
                        <Stepper.Step label="First step" description="General Information">
                            <Container fluid>
                                <Info />

                            </Container>
                        </Stepper.Step>
                        <Stepper.Step label="Second step" description="Images Dropzone" >
                            <Container fluid>
                                <ImageDropzone />
                                <Group justify="center" mt="xl">
                                    <Button size="md" variant="default" onClick={prevStep}>Back</Button>
                                    <Button size="md" onClick={handleNextStep}>Next step</Button>
                                </Group>
                            </Container>
                        </Stepper.Step>
                        <Stepper.Step label="Final step" description="Get full access">
                            Step 3 content: Get full access
                        </Stepper.Step>
                        <Stepper.Completed>
                            Completed, click back button to get to the previous step
                        </Stepper.Completed>
                    </Stepper> */}
            </Center>
        </body>
    );
}
