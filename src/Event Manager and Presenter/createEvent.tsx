import { useState } from 'react';

import {
    Container, Center, Button, Stepper, Group
} from '@mantine/core';

import Navbar from "../components/navbar";
import Info from "../Event Manager and Presenter/information";
import ImageDropzone from "../Event Manager and Presenter/image.dropzone";

// import styles from "../components/styles.module.css";

// import {
//     IconLock,
//     IconMail,
//     IconCalendarEvent,
//     IconUserPlus
// } from "@tabler/icons-react";

export default function CreateEvent() {

    const [activeNavbarIndex] = useState(1);


    // step controller
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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

                    <Stepper iconSize={37} active={active} onStepClick={setActive} allowNextStepsSelect={false} style={{
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
                            </Container>
                        </Stepper.Step>
                        <Stepper.Step label="Final step" description="Get full access">
                            Step 3 content: Get full access
                        </Stepper.Step>
                        <Stepper.Completed>
                            Completed, click back button to get to previous step
                        </Stepper.Completed>
                    </Stepper>

                    <Group justify="center" mt="xl">
                        <Button size="md" variant="default" onClick={prevStep}>Back</Button>
                        <Button size="md" onClick={nextStep}>Next step</Button>
                    </Group>

                </Container>
            </Center>

        </body >
    );

}