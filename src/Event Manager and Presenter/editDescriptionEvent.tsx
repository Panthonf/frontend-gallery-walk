import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import { Button, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import axios from "axios";
interface EditDescriptionEventProps {
  data: {
    onDataChange: (data: { value: boolean }) => void;
    description: string;
    eventId: number;
  };
}
const EditDescriptionEvent: React.FC<EditDescriptionEventProps> = ({
  data: { onDataChange, description, eventId },
}) => {
  const editorDescription = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: description,
    onUpdate() {
      console.log(editorDescription?.getHTML());
      if (editorDescription) {
        form.setFieldValue("description", editorDescription.getHTML());
      }
    },
  });

  const [data, setData] = useState({ value: true });

  const handleInputChange = () => {
    setData({ value: false });
  };

  // Call the callback function to send the data to the parent
  useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

  const form = useForm({
    initialValues: {
      description: description,
    },
    validate: {
      description: (value) => {
        if (value === "" || value === "<p></p>" || value === "<p><br></p>") {
          return "Description is required";
        }
      },
    },
  });

  const onSubmit = async () => {
    console.log("pope", form.values);
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/${eventId}`,
          {
            description: form.values.description,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("update description", res.data);
          handleInputChange();
        })
        .catch((err) => {
          console.log("update description error", err);
        });
    } catch {
      console.log("error");
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <RichTextEditor editor={editorDescription}>
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
        <RichTextEditor.Content {...form.getInputProps("description")} />
      </RichTextEditor>
      {form.errors.description && (
        <Text c="red" mt="sm">
          {form.errors.description}
        </Text>
      )}

      <Button
        onClick={() => {
          handleInputChange();
        }}
        variant="white"
        size="xs"
        mt="md"
      >
        Cancel
      </Button>

      <Button variant="light" size="xs" mt="md" rightSection type="submit">
        Save
      </Button>
    </form>
  );
};

export default EditDescriptionEvent;
