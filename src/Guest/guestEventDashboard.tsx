// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { NotFoundTitle } from "../components/notFoundTitle";
// import {
//   Card,
//   Image,
//   Text,
//   Anchor,
//   Divider,
//   Flex,
//   Collapse,
//   LoadingOverlay,
//   Title,
//   Progress,
//   Center,
// } from "@mantine/core";
// import moment from "moment";
// import ProjectsDashboard from "./projectsDashboard";
// import { useDisclosure } from "@mantine/hooks";

import { useEffect, useState } from "react";

// export default function GuestEventDashboard() {
//   const navigate = useNavigate();
//   let { eventId } = useParams();
//   const [eventData, setEventData] = useState<EventType | null>(null);
//   const [thumbnailUrl, setThumbnailUrl] = useState<string>(
//     `https://placehold.co/600x400/f9d1d1/FFFFFF?text=${eventId}`
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [eventManager, setEventManager] = useState<EventManagerType | null>(
//     null
//   );
//   const [opened, { toggle }] = useDisclosure(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [guestData, setGuestData] = useState<string | null>(null);

//   const fetchThumbnail = async (eventId: string) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/thumbnail/${eventId}`,
//         {
//           withCredentials: true,
//         }
//       );
//       if (response.data.success === false) {
//         return;
//       } else {
//         setThumbnailUrl(response.data.data[0].thumbnail_url);
//       }
//     } catch (error) {
//       // console.error("Error fetching thumbnail:", error);
//     }
//   };

//   const fetchEventManager = async (userId: string) => {
//     try {
//       const response = await axios.get(
//         `${
//           import.meta.env.VITE_BASE_ENDPOINTMENT
//         }events/event-manager-info/${userId}`,
//         {
//           withCredentials: true,
//         }
//       );
//       setEventManager(response.data.data);
//     } catch (error) {
//       setEventManager(null);
//     }
//   };

//   eventId = eventId || localStorage.getItem("event_id") || "";

//   useEffect(() => {
//     if (eventId === "") {
//       navigate("/guest/login");
//     }
//     const fetchEventData = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/events/${eventId}`,
//           {
//             withCredentials: true,
//           }
//         );
//         document.title = `${response.data.data.event_name}`;
//         setEventData(response.data.data);
//         setIsLoading(false);
//       } catch (error) {
//         handleFetchError(error as Error);
//       }
//     };

//     const handleFetchError = (error: Error) => {
//       if (axios.isAxiosError(error) && error.response?.status === 401) {
//         localStorage.setItem("event_id", eventId || "");
//         navigate("/guest/login");
//       } else {
//         setError("Event not found");
//         navigate("/404");
//       }
//     };

//     const fetchGuestData = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/data`,
//           {
//             withCredentials: true,
//           }
//         );
//         if (response.data.data) {
//           setGuestData(response.data.data);
//           localStorage.setItem("guest_id", response.data.data.id);
//         }
//       } catch (error) {
//         setError("Guest not found");
//       }
//     };

//     if (eventId) {
//       fetchEventData();
//       fetchThumbnail(eventId);
//       fetchEventManager(eventData?.user_id || "");
//       fetchGuestData();
//     }
//   }, [eventData?.user_id, eventId, navigate]);

//   if (!eventId || isLoading) {
//     return <LoadingIndicator />;
//   }

//   return (
//     <div>
//       {error ? (
//         <NotFoundTitle />
//       ) : (
//         <div>
//           <Card
//             mt="lg"
//             shadow="sm"
//             padding="xl"
//             component="a"
//             style={{ margin: "auto", width: "70%" }}
//           >
//             <Card.Section>
//               <Image src={thumbnailUrl} height={200} />
//             </Card.Section>
//             <Text mt="lg" size="xs" fs="italic">
//               {`${moment(eventData?.start_date).format(
//                 "MMMM Do YY HH:mm a"
//               )} - ${moment(eventData?.end_date).format("MMMM Do YY HH:mm a")}`}
//             </Text>

//             {/* Virtual Money Card */}
//             <Flex justify="space-between" align="center">
//               <Title mt="xs" order={1} fw={700} c="#EB5353">
//                 {eventData?.event_name}
//               </Title>
//               <Card
//                 withBorder
//                 radius="md"
//                 padding="xl"
//                 bg="var(--mantine-color-body)"
//               >
//                 <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
//                   Your Virtual Money
//                 </Text>
//                 <Text fz="lg" fw={500}>
//                   2000 / {eventData?.virtual_money} {eventData?.unit_money}
//                 </Text>
//                 <Progress
//                   value={(100 * 2000) / (eventData?.virtual_money ?? 0) || 0}
//                   mt="md"
//                   size="lg"
//                   radius="xl"
//                 />
//                 <Center mt="md">
//                   {(100 * 2000) / (eventData?.virtual_money ?? 0) || 0} %
//                 </Center>
//               </Card>
//             </Flex>
//             <Anchor mt="sm" onClick={toggle} underline="always">
//               Show Details
//             </Anchor>
//             <Collapse in={opened}>
//               <Text mt="xs">
//                 <div
//                   dangerouslySetInnerHTML={{
//                     __html: eventData?.description.toString() || "",
//                   }}
//                 />
//               </Text>
//               <Flex mt="lg" justify="start">
//                 <Anchor href={eventData?.video_link} underline="always">
//                   Video Link
//                 </Anchor>
//               </Flex>{" "}
//               {eventManager?.id && (
//                 <>
//                   <Divider mt="lg" mb="lg" />
//                   <Text size="sm" fs="italic">
//                     {`This event is organized by ${eventData?.organization} and hosted by ${eventManager?.first_name_en} ${eventManager?.last_name_en}`}
//                     <Anchor href={`mailto:${eventManager?.email}`} c="#9093A4">
//                       {" "}
//                       {eventManager?.email}
//                     </Anchor>
//                   </Text>
//                 </>
//               )}
//             </Collapse>
//           </Card>

//           <ProjectsDashboard eventId={eventData?.id.toString()} />
//         </div>
//       )}
//     </div>
//   );
// }

// const LoadingIndicator = () => (
//   <LoadingOverlay
//     visible={true}
//     zIndex={1000}
//     overlayProps={{ radius: "sm", blur: 2 }}
//     loaderProps={{ color: "", type: "oval" }}
//     transitionProps={{ duration: 2000 }}
//   />
// );

// type EventType = {
//   id: number;
//   event_name: string;
//   start_date: string;
//   end_date: string;
//   description: string;
//   published: boolean;
//   organization: string;
//   video_link: string;
//   user_id: string;
//   virtual_money: number;
//   unit_money: string;
// };

// type EventManagerType = {
//   first_name_en: string;
//   last_name_en: string;
//   email: string;
//   id: string;
// };

import axios from "axios";
import {
  Anchor,
  Card,
  // Center,
  Collapse,
  Flex,
  // Progress,
  Text,
  Title,
  Image,
  Divider,
} from "@mantine/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProjectsDashboard from "./projectsDashboard";
import moment from "moment";
import { useDisclosure } from "@mantine/hooks";
import { LoadingIndicator } from "../components/loading";

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
export default function GuestEventDashboard() {
  const { eventId } = useParams();
  const guestId = useLocation().search.split("=")[1];
  const navigate = useNavigate();
  const [eventData, setEventData] = useState<EventType | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    `https://placehold.co/600x400/f9d1d1/FFFFFF?text=${eventId}`
  );
  const [opened, { toggle }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);
  const [guestData, setGuestData] = useState<GuestType | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        await axios
          .get(
            `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/events/${eventId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log("event data", res.data.data);
            document.title = `${res.data.data.event_name}`;
            setEventData(res.data.data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log("err", err.response.data.success);
            navigate("/404");
          });
      } catch (error) {
        console.log("err", error);
        navigate("/404");
      }
    };
    const fetchThumbnail = async () => {
      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }events/thumbnail/${eventId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log("fetch thumbnail", res.data.data[0].thumbnail_url);
            setThumbnailUrl(res.data.data[0].thumbnail_url);
          })
          .catch(() => {
            // console.log("err", err);
          });
      } catch (err) {
        // console.log("err", err);
      }
    };

    const checkGuestSession = async () => {
      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }guests/check-guest-session?eventId=${eventId}&guestId=${guestId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            if (res.data.success === false) {
              navigate("/guest/login");
            }
          })
          .catch((err) => {
            console.log("err", err);
            navigate("/guest/login");
          });
      } catch (err) {
        navigate("/guest/login");
      }
    };

    const fetchGuestData = async () => {
      try {
        await axios
          .get(
            `${import.meta.env.VITE_BASE_ENDPOINTMENT}guests/get-guest-data`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log("guest data", res.data.data);
            if (res.data.data) {
              setGuestData(res.data.data);
            } else {
              navigate("/guest/login");
            }
          })
          .catch((err) => {
            console.log("err", err);
            navigate("/guest/login");
          });
      } catch (err) {
        console.log("err", err);
        navigate("/guest/login");
      }
    };

    if (guestId)
      if (eventId) {
        checkGuestSession();
        fetchEventData();
        fetchThumbnail();
        fetchGuestData();
      } else {
        navigate("/guest/login");
      }
  }, [eventId, guestId, navigate]);

  if (!eventId || isLoading) {
    return <LoadingIndicator />;
  }

  return (
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

        {/* Virtual Money Card */}
        <Flex justify="space-between" align="center">
          <Title mt="lg" order={1} fw={700}>
            {eventData?.event_name}
          </Title>
        </Flex>
        <Text size="xs" mt="5" c="#9093A4">
          {`${moment(eventData?.start_date).format(
            "MMMM Do YY HH:mm A"
          )} - ${moment(eventData?.end_date).format("MMMM Do YY HH:mm A")}`}
        </Text>
        <Divider mt="lg" mb="lg" />
        <Flex justify="flex-start ">
          <Anchor
            variant="filled"
            onClick={toggle}
            size="xs"
            underline="always"
            c="gray"
          >
            See Description
          </Anchor>
        </Flex>
        <Collapse in={opened}>
          <Text mt="lg">
            <div
              dangerouslySetInnerHTML={{
                __html: eventData?.description.toString() || "",
              }}
            />
          </Text>
          <Flex mt="lg" justify="start">
            {eventData?.video_link ? (
              <Anchor href={eventData?.video_link} underline="always">
                Video Link
              </Anchor>
            ) : (
              ""
            )}
          </Flex>{" "}
          {/* {eventManager?.id && (
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
        )} */}
        </Collapse>
      </Card>

      <Card
        mt="lg"
        shadow="sm"
        padding="xl"
        component="a"
        style={{ margin: "auto", width: "70%" }}
        withBorder
        radius="md"
        bg="var(--mantine-color-body)"
      >
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          Your Virtual Money
        </Text>
        <Divider mt="md" mb="md" />
        <Text fz="lg" fw={500}>
          {guestData?.virtual_money.toLocaleString()} {eventData?.unit_money}
        </Text>
      </Card>
      <ProjectsDashboard eventId={eventData?.id.toString()} />
    </div>
  );
}
