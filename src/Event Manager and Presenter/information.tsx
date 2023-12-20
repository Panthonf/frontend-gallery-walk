import {
    Text, Grid, Flex, Input, Group,
    Radio, CheckIcon,
} from '@mantine/core';
import { useForm } from "@mantine/form";

import { DateTimePicker } from '@mantine/dates';

export default function Information() {

    const form = useForm({
        initialValues: {
            eventName: "",
            startDateEvent: new Date(),
            endDateEvent: new Date(),
            startDateProject: new Date(),
            endDateProject: new Date(),


            virtualMoney: "",
            unit: "",
            inputValue: "",

        },


        // validate: {
        //     firstName: (value) =>
        //         value.length < 2 ? 'First name is too short' : null,
        //     lastName: (value) =>
        //         value.length < 2 ? 'Last name is too short' : null,
        //     firstNameTH: (value) =>
        //         value.length < 2 ? 'First name is too short' : null,
        //     lastNameTH: (value) =>
        //         value.length < 2 ? 'Last name is too short' : null,
        //     affiliation: hasLength({ min: 2, max: 10 }, 'affiliation must be 2-10 characters long'),
        //     email: (value) =>
        //         /^\S+@\S+$/.test(value) ? null : "Invalid email",
        //     password: hasLength({ min: 6, max: 12 }, 'password must be 6-12 characters long'),
        //     confirmPassword: (value, values) =>
        //         value !== values.password ? 'Passwords did not match' : null,
        // },
        // transformValues: (values) => ({
        //     fullName: `${values.firstName} ${values.lastName}`,
        //     fullNameTH: `${values.firstNameTH} ${values.lastNameTH}`,

        // }),
    });

    return (
        <div>
            <form
                onSubmit={form.onSubmit((values) =>
                    console.log(values)
                )}
                style={{
                    height: "100%",
                    width: "100%",
                    margin: "3rem 0 0 0"
                }}
                >
                <Grid mb="xl">

                    <Grid.Col span={12}>
                        <Text>Event Manager Details</Text>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Input.Wrapper
                            label="Event Name"
                            error=""
                            {...form.getInputProps("eventName")}>
                            <Input placeholder="Event Name" />
                        </Input.Wrapper>

                    </Grid.Col>

                    <Grid.Col span={4}>
                        <Input.Wrapper
                            label="Start Date Time"
                            error=""
                            {...form.getInputProps("startDateEvent")}>
                            <DateTimePicker
                                size="md"
                                defaultValue={new Date()}
                                placeholder="Start Date Time" />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Input.Wrapper
                            label="End Date Time"
                            error=""
                            {...form.getInputProps("endDateEvent")}>
                            <DateTimePicker
                                size="md"
                                placeholder="End Date Time" />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Text ta="center" my="auto">sjfksjdflsdjf</Text>
                    </Grid.Col>
                </Grid>

                <Grid mb="xl">

                    <Grid.Col span={12}>
                        <Text>Presenter Details</Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Input.Wrapper
                            label="Start Date Time"
                            error=""
                            {...form.getInputProps("startDateProject")}>
                            <DateTimePicker
                                size="md"
                                defaultValue={new Date()}
                                placeholder="Start Date Time" />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Input.Wrapper
                            label="End Date Time"
                            error=""
                            {...form.getInputProps("endDateProject")}>
                            <DateTimePicker
                                size="md"
                                placeholder="End Date Time" />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Text ta="center" my="auto">sjfksjdflsdjf</Text>
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
                            withAsterisk
                        >
                            <Group mt="xs" gap="3rem">
                                <Flex align="center">
                                    <Radio icon={CheckIcon} size="xs" color="redcolor.4" mr="md" value="default" />
                                    <Text>Default virtual money</Text>
                                </Flex>

                                <Flex align="center">
                                    <Radio icon={CheckIcon} size="xs" color="redcolor.4" mr="md" value="custom" />
                                    <Text>Customize virtual money</Text>
                                </Flex>

                            </Group>
                        </Radio.Group>
                    </Grid.Col>

                    <Grid.Col span={8}>
                        <Input.Wrapper
                            label="Virtual money"
                            error=""
                            {...form.getInputProps("virtualMoney")}>
                            <Input placeholder="Virtual money" />
                        </Input.Wrapper>

                    </Grid.Col>

                    <Grid.Col span={4}>
                        <Input.Wrapper
                            label="Unit"
                            error=""
                            {...form.getInputProps("unit")}>
                            <Input placeholder="Unit" />
                        </Input.Wrapper>

                    </Grid.Col>

                </Grid>


                <Group justify="flex-end" mt="xl">
                    {/* <Button
                                        w="100%"
                                        size="md"
                                        justify="center"
                                        type="submit">
                                        <Text c="pinkcolor.1">Sign-up</Text>
                                    </Button> */}
                </Group>
            </form>
        </div>
    );

}