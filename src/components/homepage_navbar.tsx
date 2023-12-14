// import mantine component
import { 
    Grid,
    Text,
    Container,
    Flex,
    Button,
    Divider
} from "@mantine/core";
import "@mantine/core/styles.css";

export default function HomepageNavbar() {

    return (
        <body>
            {/* navbar container */}
            <Container fluid p="xl">
                <Grid align="center">
                    {/* website name */}
                    <Grid.Col span="auto">
                        <Text>Gallery walk</Text>
                    </Grid.Col>

                    {/* login-register btn */}
                    <Grid.Col span="auto">
                        <Flex justify="flex-end" align="center" gap="lg">
                            <a href="/login">
                                <Button variant="transparent" size="md">
                                    <Text c="redcolor.4">Login</Text>
                                </Button>
                            </a>

                            <a href="/register">
                                <Button size="md">
                                    <Text c="pinkcolor.1">Sign-up</Text>
                                </Button>
                            </a>
                        </Flex>
                    </Grid.Col>
                </Grid>

                <Divider my="sm" color="graycolor.2" />
            </Container>
        </body>
    );
}
