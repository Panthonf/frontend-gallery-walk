import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Text, Card, Title, Switch, Flex, Anchor } from "@mantine/core";

import moment from "moment";

interface EventType {
  event_name: string;
  start_date: string;
  description: string;
  published: boolean;
  end_date: string;
  video_link: string;
  number_of_member: number;
  virtual_money: number;
  unit_money: string;
}

export default function Event() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventType | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`http://localhost:8080/events/${eventId}`, {
            withCredentials: true,
          })
          .then((res) => {
            console.log(res.data.data);
            setEvent(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchData();

    document.title = `${event?.event_name} | Virtual Event Manager`;
  }, [eventId, event?.event_name]);

  const [isPublished, setIsPublished] = useState(event?.published || false);

  const handlePublishToggle = async () => {
    await axios
      .put(`http://localhost:8080/events/${eventId}/publish`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("dd", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsPublished((prev) => !prev);
  };
  return (
    <Card
      shadow="md"
      padding="lg"
      radius="lg"
      style={{ maxWidth: 400, margin: "50px auto" }}
    >
      <Title order={1}>
        <Text size="lg" style={{ marginTop: 5 }}>
          {event?.event_name}
        </Text>
      </Title>
      <div style={{ marginTop: 20 }}>
        <Flex justify={"space-between"}>
          <Text size="md" style={{ marginTop: 10 }} color="gray">
            Start Date:
          </Text>
          <Text size="lg" style={{ marginTop: 5 }}>
            {moment(event?.start_date).format("DD/MM/YYYY")}
          </Text>

          <Text size="md" w={500} color="gray" style={{ marginTop: 10 }}>
            End Date:
          </Text>
          <Text size="lg" style={{ marginTop: 5 }}>
            {moment(event?.end_date).format("DD/MM/YYYY")}
          </Text>
        </Flex>

        <Text size="md" w={500} color="gray" style={{ marginTop: 10 }}>
          Description:
        </Text>
        <Text size="lg" style={{ marginTop: 5 }}>
          {event?.description}
        </Text>

        <Text size="md" w={500} color="gray" style={{ marginTop: 10 }}>
          Video Link
        </Text>
        <a href={event?.video_link} target="_blank">
          {event?.video_link}
        </a>
        <Text size="md" w={500} color="gray" style={{ marginTop: 10 }}>
          Member
        </Text>
        <Text size="lg" style={{ marginTop: 5 }}>
          {event?.number_of_member}
        </Text>

        <Text size="md" w={500} color="gray" style={{ marginTop: 10 }}>
          Virtual Money
        </Text>
        <Text size="lg" style={{ marginTop: 5 }}>
          {event?.virtual_money} {event?.unit_money}
        </Text>

        <Text>
          <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
            <Switch
              checked={isPublished}
              onChange={handlePublishToggle}
              onLabel="Published"
              offLabel="Unpublished"
              id="publish-toggle"
              size="lg"
            />
          </div>
        </Text>

        <Anchor href="/dashboard">Back</Anchor>
      </div>
    </Card>
  );
}
