import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { NotFoundTitle } from "../components/notFoundTitle";
import {
  Card,
  Image,
  Text,
  Anchor,
  Divider,
  Flex,
  Collapse,
} from "@mantine/core";
import moment from "moment";
import ProjectsDashboard from "./projectsDashboard";
import { useDisclosure } from "@mantine/hooks";

export default function GuestEventDashboard() {
  const navigate = useNavigate();
  let { eventId } = useParams();
  const [eventData, setEventData] = useState<EventType | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    "https://via.placeholder.com/300x200.png?text=No+thumbnail+found"
  );
  const [error, setError] = useState<string | null>(null);
  const [eventManager, setEventManager] = useState<EventManagerType | null>(
    null
  );
  const [opened, { toggle }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchThumbnail = async (eventId: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/thumbnail/${eventId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success === false) {
        setThumbnailUrl(
          "https://via.placeholder.com/300x200.png?text=No+thumbnail+found"
        );
      } else {
        setThumbnailUrl(response.data.data[0].thumbnail_url);
      }
    } catch (error) {
      // console.error("Error fetching thumbnail:", error);
      setThumbnailUrl(
        "https://via.placeholder.com/300x200.png?text=No+thumbnail+found"
      );
    }
  };

  const fetchEventManager = async (userId: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_ENDPOINTMENT
        }events/event-manager-info/${userId}`,
        {
          withCredentials: true,
        }
      );
      setEventManager(response.data.data);
    } catch (error) {
      // console.error("Error fetching event manager:", error);
      setEventManager(null);
    }
  };

  eventId = eventId || localStorage.getItem("event_id") || "";

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/events/${eventId}`,
          {
            withCredentials: true,
          }
        );
        document.title = `${response.data.data.event_name}`;
        setEventData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        // console.error("Error fetching event:", error);
        handleFetchError(error as Error);
      }
    };

    const handleFetchError = (error: Error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.setItem("event_id", eventId || "");
        navigate("/guest/login");
      } else {
        setError("Event not found");
        navigate("/404");
      }
    };

    if (eventId) {
      fetchEventData();
      fetchThumbnail(eventId);
      fetchEventManager(eventData?.user_id || "");
    }
  }, [eventData?.user_id, eventId, navigate]);

  if (!eventId || isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      {error ? (
        <NotFoundTitle />
      ) : (
        <div>
          <Card
            mt="lg"
            shadow="sm"
            padding="xl"
            component="a"
            style={{ margin: "auto", width: "70%" }}
          >
            <Card.Section>
              <Image src={thumbnailUrl} height={200} />
            </Card.Section>
            <Text mt="lg" size="xs" fs="italic">
              {`${moment(eventData?.start_date).format(
                "MMMM Do YY HH:mm a"
              )} - ${moment(eventData?.end_date).format("MMMM Do YY HH:mm a")}`}
            </Text>
            <Text mt="xs" size="xl" fw={700} c="#EB5353">
              {eventData?.event_name}
            </Text>
            <Anchor mt="sm" onClick={toggle} underline="always">
              Show Details
            </Anchor>
            <Collapse in={opened}>
              <Text mt="xs">
                {eventData?.description || "No description available."}
              </Text>
              <Flex mt="lg" justify="start">
                <Anchor href={eventData?.video_link} underline="always">
                  Video Link
                </Anchor>
              </Flex>{" "}
              {eventManager?.id && (
                <>
                  <Divider mt="lg" mb="lg" />
                  <Text size="sm" fs="italic">
                    {`This event is organized by ${eventData?.organization} and hosted by ${eventManager?.first_name_en} ${eventManager?.last_name_en}`}
                    <Anchor href={`mailto:${eventManager?.email}`} c="#9093A4">
                      {" "}
                      {eventManager?.email}
                    </Anchor>
                  </Text>
                </>
              )}
            </Collapse>
          </Card>

          <ProjectsDashboard eventId={eventData?.id.toString()} />
        </div>
      )}
    </div>
  );
}

const LoadingIndicator = () => (
  <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
);

type EventType = {
  id: number;
  event_name: string;
  start_date: string;
  end_date: string;
  description: string;
  published: boolean;
  organization: string;
  video_link: string;
  user_id: string;
};

type EventManagerType = {
  first_name_en: string;
  last_name_en: string;
  email: string;
  id: string;
};
