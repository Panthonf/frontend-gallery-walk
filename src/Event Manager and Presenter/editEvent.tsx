import {
  Button,
  Card,
  Divider,
  Flex,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput, DateValue, TimeInput } from "@mantine/dates";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ActionIcon, rem } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Navbar from "../components/navbar";
import Swal from "sweetalert2";

function EditEvent() {
  const refStartTime = useRef<HTMLInputElement>(null);
  const refEndTimeEvent = useRef<HTMLInputElement>(null);
  const refStartTimeSubmit = useRef<HTMLInputElement>(null);
  const refEndTimeSubmit = useRef<HTMLInputElement>(null);
  const [event, setEvent] = useState<Event>();
  const eventId = useParams<{ eventId: string }>().eventId;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    onUpdate({ editor }) {
      console.log(editor.getHTML());
      setEvent({
        ...event,
        description: editor.getHTML(),
        start_date: event?.start_date ?? "",
        end_date: event?.end_date ?? "",
        event_name: event?.event_name ?? "",
        submit_start: event?.submit_start ?? "",
        submit_end: event?.submit_end ?? "",
        start_time_event: event?.start_time_event ?? "",
        end_time_event: event?.end_time_event ?? "",
        start_time_submit: event?.start_time_submit ?? "",
        end_time_submit: event?.end_time_submit ?? "",
      });
    },
  });

  useEffect(() => {
    document.title = "Edit Event | Event Manager and Presenter";

    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            withCredentials: true,
          }
        );

        const eventData = response.data.data;

        setEvent({
          ...eventData,
          start_time_event: moment(eventData.start_date).format("HH:mm"),
          end_time_event: moment(eventData.end_date).format("HH:mm"),
          start_time_submit: moment(eventData.submit_start).format("HH:mm"),
          end_time_submit: moment(eventData.submit_end).format("HH:mm"),
        });

        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  if (event.description) {
    editor?.commands.setContent(event.description);
  }

  const pickerControlStartTime = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refStartTime.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerControlEndTimeEvent = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refEndTimeEvent.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerControlStartTimeSubmit = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refStartTimeSubmit.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerControlEndTimeSubmit = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refEndTimeSubmit.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const onSubmit = async () => {
    try {
      const updatedEvent = {
        ...event,
        description: editor?.getHTML() ?? "",
        event_name: event?.event_name ?? "",
        start_date: moment(event?.start_date, "YYYY-MM-DD HH:mm").toISOString(),
        end_date: moment(event?.end_date, "YYYY-MM-DD HH:mm").toISOString(),
        submit_start: moment(
          event?.submit_start,
          "YYYY-MM-DD HH:mm"
        ).toISOString(),
        submit_end: moment(event?.submit_end, "YYYY-MM-DD HH:mm").toISOString(),
      };

      setEvent(updatedEvent);

      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          updatedEvent,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("update event", res.data);
          Swal.fire({
            title: "Event Updated",
            text: "Event has been updated successfully",
            icon: "success",
            confirmButtonText: "Ok",
          });
        });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Event could not be updated",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleInputChange = (fieldName: string, value: string | DateValue) => {
    // Use moment to handle date values consistently
    const formattedValue =
      typeof value === "string" ? value : moment(value).toISOString();

    setEvent({
      ...event,
      [fieldName]: formattedValue,
    });
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevents the default form submission behavior
          // Add your form submission logic here
          console.log("Form submitted", event);
          const startDate = moment(
            `${event.start_date} ${event.start_time_event}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
          console.log("start date", startDate);
          const endDate = moment(
            `${event.end_date} ${event.end_time_event}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
          console.log("end date", endDate);

          const submitStart = moment(
            `${event.submit_start} ${event.start_time_submit}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
          console.log("submit start", submitStart);
          const submitEnd = moment(
            `${event.submit_end} ${event.end_time_submit}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
          console.log("submit end", submitEnd);
        }}
      >
        <Card
          mb="lg"
          mt="lg"
          shadow="sm"
          padding="md"
          radius="md"
          style={{ maxWidth: "500px", margin: "auto" }}
        >
          <Title order={2} c="red">
            Edit Event
          </Title>
          <Title mt="lg" order={4} c="red.4">
            Event Details
          </Title>
          <Divider />
          <TextInput
            mt="sm"
            label="Event Name"
            placeholder="Event Name"
            value={event?.event_name}
            onChange={(e) => {
              handleInputChange("event_name", e.currentTarget.value);
            }}
          />
          <Flex mt="sm" justify="flex-start">
            <div>
              {/* {moment(event?.start_date).format("MMMM Do, YYYY")} */}
              <DateInput
                mt="sm"
                label={`Start Date: ${moment(event?.start_date).format(
                  "MMMM Do, YYYY"
                )}`}
                placeholder="Start Date"
                onChange={(e) => {
                  handleInputChange("start_date", e?.toISOString() ?? "");
                }}
              />
            </div>
            <TimeInput
              ml="lg"
              mt="sm"
              label={`Start Time: ${event?.start_time_event.toLocaleString()}`}
              placeholder="Start Time"
              ref={refStartTime}
              rightSection={pickerControlStartTime}
              // value={event?.start_time_event.toLocaleString()}
              onChange={(e) => {
                console.log(e.currentTarget.value);
                handleInputChange("start_time_event", e.currentTarget.value);
              }}
            />
          </Flex>

          <Flex mt="sm" justify="flex-start">
            <DateInput
              mt="sm"
              label="End Date"
              placeholder="End Date"
              value={moment(event?.end_date).toDate()}
              onChange={(e) => {
                handleInputChange("end_date", e?.toISOString() ?? "");
              }}
            />
            <TimeInput
              ml="lg"
              mt="sm"
              label="End Time"
              placeholder="End Time"
              ref={refEndTimeEvent}
              rightSection={pickerControlEndTimeEvent}
              value={event?.end_time_event.toLocaleString()}
              onChange={(e) => {
                console.log(e.currentTarget.value);
                handleInputChange("end_time_event", e.currentTarget.value);
              }}
            />
          </Flex>

          <Text mt="sm">Descriptions</Text>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>

          <Title order={4} mt="lg" c="red.4">
            Submission Period
          </Title>
          <Divider />

          <Flex mt="sm" justify="flex-start">
            <DateInput
              mt="sm"
              label="Submission Start Date"
              placeholder="Submission Start Date"
              value={moment(event?.submit_start).toDate()}
              onChange={(e) => {
                handleInputChange("submit_start", e?.toISOString() ?? "");
              }}
            />
            <TimeInput
              ml="lg"
              mt="sm"
              label="Submission Start Time"
              placeholder="Submission Start Time"
              ref={refStartTimeSubmit}
              rightSection={pickerControlStartTimeSubmit}
              value={event?.start_time_submit.toLocaleString()}
              onChange={(e) => {
                console.log(e.currentTarget.value);
                handleInputChange("start_time_submit", e.currentTarget.value);
              }}
            />
          </Flex>

          <Flex mt="sm" justify="flex-start">
            <DateInput
              mt="sm"
              label="Submission End Date"
              placeholder="Submission End Date"
              value={moment(event?.submit_end).toDate()}
              onChange={(e) => {
                handleInputChange("submit_end", e?.toISOString() ?? "");
              }}
            />
            <TimeInput
              ml="lg"
              mt="sm"
              label="Submission End Time"
              placeholder="Submission End Time"
              ref={refEndTimeSubmit}
              rightSection={pickerControlEndTimeSubmit}
              value={event?.end_time_submit.toLocaleString()}
              onChange={(e) => {
                console.log(e.currentTarget.value);
                handleInputChange("end_time_submit", e.currentTarget.value);
              }}
            />
          </Flex>

          <Button type="submit" mt="lg" mx="auto" variant="filled" radius="sm">
            Edit Event
          </Button>
        </Card>
      </form>
    </>
  );
}

type Event = {
  end_time_submit: string | Date;
  start_time_submit: string | Date;
  end_time_event: string | Date;
  event_name: string;
  start_date: string | Date;
  end_date: string | Date;
  description: string;
  submit_start: string | Date;
  submit_end: string | Date;
  start_time_event: string | Date;
};

export default EditEvent;
