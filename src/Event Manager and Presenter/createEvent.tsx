import { useState } from 'react';
import axios from 'axios';

import {
    Container, Center, Button, Stepper, Group, Flex, Grid, Input, Text, Radio, CheckIcon, TextInput
} from '@mantine/core';
import { useForm, isNotEmpty } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";

import Navbar from "../components/navbar";

export default function CreateEvent() {

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

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const form = useForm({
        initialValues: {
            eventName: "",
            startDateEvent: new Date(),
            endDateEvent: "",
            startDateProject: new Date(),
            endDateProject: "",

            virtualMoney: 10000,
            unit: "coin",
        },

        validate: {
            eventName: isNotEmpty('Enter your event name'),
            virtualMoney: isNotEmpty('Enter your virtual money or use default virtual money'),
            unit: isNotEmpty('Enter your unit or use default unit'),
        },
        // transformValues: (values) => ({
        //     fullName: `${values.firstName} ${values.lastName}`,
        //     fullNameTH: `${values.firstNameTH} ${values.lastNameTH}`,

        // }),
    });


    const onSubmit = async () => {

        const formData = form.values;
        console.log("ddd", formData);
        const BASE_ENDPOINT = import.meta.env.VITE_BASE_ENDPOINTMENT;

        try {
            await axios.post(`${BASE_ENDPOINT}events`, {
                event_name: formData.eventName,
                start_date: formData.startDateEvent,
                end_date: formData.endDateEvent,
                submit_start: formData.startDateProject,
                submit_end: formData.endDateProject,
                virtual_money: formData.virtualMoney,
                unit_money: formData.unit,
                description: "tttttttttt",
                number_of_member: 10
            },
                {
                    withCredentials: true,
                }
            ).then((res) => {
                console.log(res.data);

            }).catch((err) => {
                console.log("err", err);

            })
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    return (
        <body style={{
            display: "flex",
        }}>
            {/* navbar */}
            <Navbar activeIndex={activeNavbarIndex} />

            <Center style={{
                height: "100vh",
                width: "100vw"
            }}>
                {/* register container */}
                <Container fluid>

                    <Stepper active={active}>
                        <Stepper.Step label="First step" description="Profile settings">
                            <div>
                                <form
                                    onSubmit={form.onSubmit(onSubmit)}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        margin: "3rem 0 0 0",
                                    }}
                                >
                                    <Grid mb="xl">
                                        <Grid.Col span={12}>
                                            <Text>Event Manager Details</Text>
                                        </Grid.Col>
                                        <Grid.Col span={12}>
                                            <TextInput
                                                label="Event Name"
                                                placeholder="Event Name"
                                                required
                                                {...form.getInputProps("eventName")} />
                                        </Grid.Col>

                                        <Grid.Col span={4}>

                                            <DateTimePicker
                                                label="Start Date"
                                                defaultValue={new Date()}
                                                placeholder="Start Date-Time"

                                                required
                                                {...form.getInputProps("startDateEvent")}
                                            />

                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <DateTimePicker
                                                label="End Date"
                                                placeholder="End Date-Time"

                                                required
                                                {...form.getInputProps("endDateEvent")}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Text ta="center" my="auto">
                                                sjfksjdflsdjf
                                            </Text>
                                        </Grid.Col>
                                    </Grid>

                                    <Grid mb="xl">
                                        <Grid.Col span={12}>
                                            <Text>Presenter Details</Text>
                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <DateTimePicker
                                                label="Start Date"
                                                defaultValue={new Date()}
                                                placeholder="Start Date-Time"

                                                required
                                                {...form.getInputProps("startDateProject")}
                                            />

                                        </Grid.Col>
                                        <Grid.Col span={4}>

                                            <DateTimePicker
                                                label="End Date"
                                                placeholder="End Date-Time"

                                                required
                                                {...form.getInputProps("endDateProject")}
                                            />

                                        </Grid.Col>
                                        <Grid.Col span={4}>
                                            <Text ta="center" my="auto">
                                                sjfksjdflsdjf
                                            </Text>
                                        </Grid.Col>
                                    </Grid>

                                    <Grid mb="xl">
                                        <Grid.Col span={12}>
                                            <Text>Guest Details</Text>
                                        </Grid.Col>

                                        <Grid.Col>
                                            <Radio.Group
                                                name="favoriteFramework"
                                                label="Select your favorite framework/library"
                                                description="This is anonymous"
                                            >
                                                <Group mt="xs" gap="3rem">
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
                                                </Group>
                                            </Radio.Group>
                                        </Grid.Col>

                                        <Grid.Col span={8}>
                                            <TextInput
                                                label="Virtual money"
                                                placeholder="Virtual money"
                                                required
                                                {...form.getInputProps("virtualMoney")}
                                            />
                                        </Grid.Col>

                                        <Grid.Col span={4}>
                                            <TextInput
                                                label="Unit"
                                                placeholder="Unit"
                                                required
                                                {...form.getInputProps("unit")}
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <Group justify="flex-end" mt="xl">
                                        <Button
                                            w="100%"
                                            size="md"
                                            justify="center"
                                            type="submit"
                                            onClick={onSubmit}>
                                            <Text c="pinkcolor.1">Submit</Text>
                                        </Button>
                                    </Group>
                                </form>
                            </div>
                        </Stepper.Step>

                        <Stepper.Step label="Second step" description="Personal information">

                        </Stepper.Step>

                        <Stepper.Step label="Final step" description="Social media">

                        </Stepper.Step>
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
                        {active !== 3 && <Button onClick={nextStep}>Next step</Button>}
                    </Group>

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

                </Container>
            </Center>
        </body>
    );
}