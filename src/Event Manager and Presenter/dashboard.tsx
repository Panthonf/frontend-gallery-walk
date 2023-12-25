import { useEffect, useState } from "react";
import axios from "axios";
import {
  Text,
  Divider,
  Grid,
  Card,
  Button,
  Flex,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { Pagination } from "@mantine/core";
import Navbar from "../components/navbar";
import moment from "moment";

// import styles from "../components/styles.module.css";
// import { IconSearch, IconArrowRight } from '@tabler/icons-react';

import { IconSquarePlus, IconArrowsJoin } from "@tabler/icons-react";

export default function Dashboard(props: TextInputProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeNavbarIndex] = useState(0);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/events/search",
          {
            withCredentials: true,
            params: { query, page, pageSize },
          }
        );
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, [page, pageSize, query]);

  const [thumbnails, setThumbnails] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const thumbnailData = await Promise.all(
          events.map(async (event: EventType) => {
            try {
              const thumbnail = await getThumbnail(event.id);
              return { eventId: event.id, thumbnail };
            } catch (thumbnailError) {
              // console.error(
              //   `Error fetching thumbnail for event ${event.id}:`,
              //   thumbnailError
              // );
              return { eventId: event.id, thumbnail: "" }; // Return an empty string or some default value in case of an error
            }
          })
        );

        const thumbnailMap: { [key: number]: string } = {};
        thumbnailData.forEach((data) => {
          thumbnailMap[data.eventId] = data.thumbnail;
        });

        // console.log("Thumbnail Map:", thumbnailMap);
        setThumbnails(thumbnailMap);
      } catch (error) {
        console.error("Error fetching thumbnails:", error);
      }
    };

    fetchThumbnails();
  }, [events]);

  async function getThumbnail(event_id: number) {
    const thumbnail = await axios.get(
      `http://localhost:8080/events/thumbnail/${event_id}`,
      {
        withCredentials: true,
      }
    );
    return thumbnail.data.data[0].thumbnail_url;
  }

  type EventType = {
    id: number;
    event_name: string;
    start_date: string;
    end_date: string;
    virtual_money: number;
    unit_money: string;
    description: string;
    video_link: string;
  };

  return (
    <body
      style={{
        display: "flex",
      }}
    >
      {/* navbar */}
      <Navbar activeIndex={activeNavbarIndex} />

      <Grid w="100%" p="xl">
        <Grid.Col span={12}>
          {activeTab === "Overview" && (
            <div>
              <Grid justify="space-between">
                <Grid.Col span={6}></Grid.Col>
                <Grid.Col span={6}>
                  <Flex gap="lg" justify="end">
                    <Button
                      color="redcolor.4"
                      size="sm"
                      w="20%"
                      justify="center"
                      variant="filled"
                      rightSection={<IconSquarePlus size={14} />}
                    >
                      <Text c="pinkcolor.1">Create Event!</Text>
                    </Button>
                    <Button
                      color="deepredcolor.9"
                      size="sm"
                      w="20%"
                      justify="center"
                      variant="filled"
                      rightSection={<IconArrowsJoin size={14} />}
                    >
                      <Text c="pinkcolor.1">Join event</Text>
                    </Button>
                  </Flex>
                </Grid.Col>

                <Grid.Col span={12}>
                  <Divider mb="lg" />
                  <TextInput
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search events"
                  />

                  {events.map((event: EventType) => (
                    <Card
                      key={event.id}
                      shadow="sm"
                      padding="md"
                      style={{ marginBottom: "16px" }}
                    >
                      <Text size="xl">Event: {event.event_name}</Text>
                      <Text>
                        Start Date:{" "}
                        {moment(event.start_date).format("DD/MM/YYYY HH:mm")}
                      </Text>
                      <Text>
                        End Date:{" "}
                        {moment(event.end_date).format("DD/MM/YYYY HH:mm")}
                      </Text>

                      {thumbnails[event.id] && (
                        <img src={thumbnails[event.id]} width={200} />
                      )}

                      <a href={`/event/${event.id}`}>Go to event</a>
                    </Card>
                  ))}
                </Grid.Col>
              </Grid>
            </div>
          )}
          {activeTab === "Event manager" && (
            <div>{/* ... Event manager tab content ... */}</div>
          )}
          {activeTab === "Presenter" && (
            <div>{/* ... Presenter tab content ... */}</div>
          )}
        </Grid.Col>

        <Pagination
          total={events.length}
          value={page}
          onChange={(newPage) => setPage(newPage)}
        />
      </Grid>
    </body>
  );
}
