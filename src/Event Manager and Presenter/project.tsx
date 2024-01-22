import { Card, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";

type ProjectType = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export default function Projects() {
  const projectId = useParams<{ projectId: string }>().projectId;
  const [project, setProject] = useState<ProjectType | null>();
  useEffect(() => {
    const fetchProject = async () => {
      try {
        await axios
          .get(
            `${
              import.meta.env.VITE_BASE_ENDPOINTMENT
            }projects/get-data/${projectId}`,
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            console.log("res fudh", res.data.data);
            setProject(res.data.data);
            if (res.data.data == null) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Project not found!",
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = "/dashboard";
                }
              });
            }
          });
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, [projectId]);
  return (
    <>
      {project && project !== null ? (
        <Card shadow="lg" mt="lg" style={{ margin: "auto", width: "70%" }}>
          <Title order={1}>Project {projectId}</Title>
          <Title mt="lg" order={4}>
            {project?.title}
          </Title>
          <Text mt="md">{DOMPurify.sanitize(project?.description ?? "")}</Text>
          <Text mt="md">
            {moment(project?.created_at).format("DD/MM/YYYY HH:mm a")}
          </Text>
        </Card>
      ) : null}
    </>
  );
}
