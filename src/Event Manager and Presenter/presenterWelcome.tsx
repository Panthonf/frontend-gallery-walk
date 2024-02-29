import { Button, Card, Center, Title, Text, Loader } from "@mantine/core";
import { IconArrowBarRight } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PresenterWelcome() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState<{
    id: number;
    event_name: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BASE_ENDPOINTMENT
          }events/event-name/${eventId}`,
          {
            withCredentials: true,
          }
        );
        console.log("event data", res.data);
        setEventData(res.data.data);
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError("Event data not found.");
      }
    };
    fetchEventData();
  }, [eventId]);

  if (error) {
    return (
      <Center mt="lg">
        <Card p="lg" shadow="sm" maw="500px">
          <Title order={1} mb={4} c="dark.3">
            Error
          </Title>
          <Title order={3} mt={4} c="red">
            Oops! Something went wrong while fetching the event data.
          </Title>
          <Text mt="lg">
            We apologize for the inconvenience. Please try again later or
            contact support if the issue persists.
          </Text>
          <p>Error Details: {error}</p>
        </Card>
      </Center>
    );
  }

  return (
    <div>
      <Center mt="lg">
        {eventData ? (
          <>
            {" "}
            <Card p="lg" shadow="sm">
              <Center>
                <Title order={1} mb={4} ta="center">
                  Welcome to{" "}
                  <span style={{ color: "red" }}>{eventData?.event_name}</span>{" "}
                  Event
                </Title>
              </Center>
              <Center>
                <Text ta="center" mt="lg" maw={400}>
                  You are a presenter at this event. Please click the button
                  below to access the presenter dashboard.
                </Text>
              </Center>

              <Button
                radius="md"
                mt="lg"
                variant="gradient"
                size="lg"
                gradient={{ from: "orange", to: "red", deg: 90 }}
                onClick={() => {
                  window.location.href = `${
                    import.meta.env.VITE_BASE_ENDPOINTMENT
                  }presenters/${eventId}`;
                }}
                rightSection={<IconArrowBarRight size={20} />}
              >
                Access Presenter Dashboard
              </Button>
            </Card>
          </>
        ) : (
          <Loader color="red" type="dots" size={50} />
        )}
      </Center>
    </div>
  );
}
