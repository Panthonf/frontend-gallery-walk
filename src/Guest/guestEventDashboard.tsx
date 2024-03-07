import { useEffect, useState } from "react";
import axios from "axios";
import {
  Flex,
  Text,
  Grid,
  ActionIcon,
  Box,
  Modal,
  Badge,
  AspectRatio,
  Image,
  Group,
  Paper,
  Loader,
  Affix,
} from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "../styles.module.css";
import ProjectsDashboard from "./projectsDashboard";
import moment from "moment";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowsDiagonal, IconCoins } from "@tabler/icons-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

type EventType = {
  id: number;
  start_date: string;
  end_date: string;
  event_name: string;
  virtual_money: number;
  unit_money: string;
  description: string;
  video_link: string;
};

type GuestType = {
  id: number;
  first_name_en: string;
  last_name_en: string;
  email: string;
  virtual_money: number;
};

const ModalDescription = ({ eventData }: { eventData: EventType }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Text c="graycolor.2" mb="xs">
        Description
      </Text>

      <Flex align="flex-end">
        <Text lineClamp={5}>
          <div
            dangerouslySetInnerHTML={{ __html: eventData?.description || "" }}
          />
        </Text>
        <ActionIcon variant="subtle" onClick={open} color="greencolor.4">
          <IconArrowsDiagonal size={14} stroke={1.5} />
        </ActionIcon>
      </Flex>

      <Modal
        opened={opened}
        onClose={close}
        title="Description"
        centered
        radius="xs"
        size="90%"
        padding="lg"
        className={styles.scrollBar}
      >
        <Text>
          <div
            dangerouslySetInnerHTML={{ __html: eventData?.description || "" }}
          />
        </Text>
      </Modal>
    </>
  );
};

export default function GuestEventDashboard() {
  const { eventId } = useParams();
  console.log("event id", eventId);
  const guestId = useLocation().search.split("=")[1];
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<EventType | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    `https://placehold.co/400?text=${eventId}`
  );
  const [isLoading, setIsLoading] = useState(true);
  const [guestData, setGuestData] = useState<GuestType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventDataResponse, thumbnailResponse, guestDataResponse] =
          await Promise.all([
            axios.get(
              `${
                import.meta.env.VITE_BASE_ENDPOINTMENT
              }guests/events/${eventId}`,
              { withCredentials: true }
            ),
            axios.get(
              `${
                import.meta.env.VITE_BASE_ENDPOINTMENT
              }events/thumbnail/${eventId}`,
              { withCredentials: true }
            ),
            axios.get(
              `${
                import.meta.env.VITE_BASE_ENDPOINTMENT
              }guests/get-guest-data?eventId=${eventId}`,
              { withCredentials: true }
            ),
          ]);

        console.log("event data", eventDataResponse.data.data);
        document.title = `${eventDataResponse.data.data.event_name}`;
        setEventData(eventDataResponse.data.data);
        setThumbnailUrl(thumbnailResponse.data.data[0].thumbnail_url);
        setGuestData(guestDataResponse.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log("err", error);
        navigate("/404");
      }
    };

    if (!guestId || !eventId) {
      navigate("/guest/login");
      return;
    }

    fetchData();
  }, [eventId, guestId, navigate]);

  const handleModalClose = () => {
    fetchGuestData();
  };

  const fetchGuestData = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_ENDPOINTMENT
        }guests/get-guest-data?eventId=${eventId}`,
        { withCredentials: true }
      );
      console.log("guest data", response.data.data);
      if (!response.data.data) {
        navigate("/guest/login");
      }
      setGuestData(response.data.data);
    } catch (err) {
      console.log("err", err);
      navigate("/guest/login");
    }
  };

  if (!eventId || isLoading) {
    return (
      <Affix top="50%" left="50%">
        <Loader my="auto" color="greencolor.4" type="dots" size={50} />
      </Affix>
    );
  }

  return (
    <div>
      <Zoom>
        <AspectRatio ratio={970 / 150} maw="100vw">
          <Image src={thumbnailUrl} height={200} />
        </AspectRatio>
      </Zoom>

      <Box w="80%" mx="auto" style={{ position: "relative" }}>
        <Grid justify="flex-start" align="flex-start" mt="xl" mb="md">
          <Grid.Col span={12}>
            <div>
              <Text size="header" c="greencolor.4" fw={600} mb="xs">
                {eventData?.event_name}
              </Text>
              <Flex gap="2rem">
                <div>
                  <Text size="xsmall" c="graycolor.2" mb="xs">
                    Start of event
                  </Text>
                  {moment(eventData?.start_date).format("LL [at] HH:mm A")}
                </div>
                <div>
                  <Text size="xsmall" c="graycolor.2" mb="xs">
                    End of event
                  </Text>
                  {moment(eventData?.end_date).format("LL [at] HH:mm A")}
                </div>
              </Flex>

              <Badge
                color="greencolor.4"
                style={{ position: "absolute", top: "0.25rem", right: "0" }}
              >
                {moment(eventData?.end_date).fromNow()}
              </Badge>
            </div>
          </Grid.Col>

          <Grid.Col my="md">
            <Paper withBorder p="md" radius="md" bg="none" h="max-content">
              <Group justify="space-between">
                <Text c="graycolor.2">All virtual money</Text>
                <IconCoins size={16} />
              </Group>

              <Group align="flex-end" gap="xs" mt={25}>
                <Text fw={500} c="greencolor.4">
                  {guestData?.virtual_money.toLocaleString()}{" "}
                  {eventData?.unit_money}
                </Text>
              </Group>

              <Text fz="xs" c="dimmed" mt={7}>
                Your Virtual Money
              </Text>
            </Paper>
          </Grid.Col>

          <Grid.Col span={12}>
            {eventData && <ModalDescription eventData={eventData} />}
          </Grid.Col>

          <Grid.Col span={12}>
            <ProjectsDashboard
              eventId={eventData?.id.toString()}
              handleModalClose={handleModalClose}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </div>
  );
}
