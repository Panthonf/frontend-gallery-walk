import { Card, Divider, Flex, Grid, Select, Text, Title } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function EventSummary(props: { eventId: React.ReactNode }) {
  const [summary, setSummary] = useState<{
    totalProjects: number;
    totalGiveVirtualMoney: number;
    totalGiveComments: number;
    totalVirtualMoney: number;
    totalComments: number;
    projectsRanking: {
      id: number;
      title: string;
      amount: number;
    }[];
    projectsNotRanked: {
      id: number;
      title: string;
      amount: number;
    }[];
    event: {
      id: number;
      unit_money: string;
    };
  } | null>(null);

  const [selectedProject, setSelectedProject] = useState("5");

  useEffect(() => {
    const fetchProjectResult = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/event-summary/${
            props.eventId
          }`,
          {
            withCredentials: true,
          }
        );
        console.log("summary", res.data.data);
        setSummary(res.data.data);
      } catch (err) {
        console.error("Error fetching event result:", err);
      }
    };
    fetchProjectResult();
  }, [props.eventId]);

  return (
    <div>
      <Title order={1} c="red">
        Event Summary
      </Title>

      <Grid mt="lg" style={{ display: "flex" }}>
        <Grid.Col span={6}>
          {/* Column 1 */}
          <Card shadow="xs" padding="md" radius="md">
            <Flex align={"baseline"} justify={"flex-start"}>
              <Text size="xl" c={"gray"} fw="bold">
                Total Projects
              </Text>
              <Text ml="sm" size="xs" c={"gray"} fw="bold">
                (โครงการทั้งหมด)
              </Text>
            </Flex>
            <Divider />
            {summary ? (
              <Flex align={"baseline"} justify={"flex-start"} mt="3">
                <Text style={{ fontSize: "3rem" }} c="red">
                  {summary.totalProjects}
                </Text>
                <Text ml="md" fz={"sm"} fw={"unset"}>
                  projects
                </Text>
              </Flex>
            ) : (
              <Text mt="3" style={{ fontSize: "3rem" }}>
                <Text>Loading...</Text>
              </Text>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          {/* Column 1 */}
          <Card shadow="xs" padding="md" radius="md">
            <Flex align={"baseline"} justify={"flex-start"}>
              <Text size="xl" c={"gray"} fw="bold">
                Total Virtual Money
              </Text>
              <Text ml="sm" size="xs" c={"gray"} fw="bold">
                (จำนวน Virtual Money ที่ทุกโครงการได้รับ)
              </Text>
            </Flex>
            <Divider />
            {summary ? (
              <Flex align={"baseline"} justify={"flex-start"} mt="3">
                <Text style={{ fontSize: "3rem" }} c="red">
                  {summary.totalVirtualMoney.toLocaleString()}
                </Text>
                <Text ml="md" fz={"sm"} fw={"unset"}>
                  {summary.event.unit_money}
                </Text>
              </Flex>
            ) : (
              <Text mt="3" style={{ fontSize: "3rem" }}>
                <Text>Loading...</Text>
              </Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      <Grid mt="lg">
        <Grid.Col span={6} h="100%">
          <Card shadow="xs" padding="md" radius="md">
            <Flex align={"baseline"} justify={"flex-start"}>
              <Text size="xl" c={"gray"} fw="bold">
                Guest Contributors
              </Text>
              <Text ml="sm" size="xs" c={"gray"} fw="bold">
                (การมีส่วนร่วมของแขกผู้เข้าร่วม)
              </Text>
            </Flex>

            <Divider />
            <Grid mt="lg" h="100%">
              <Grid.Col span={6}>
                <Card shadow="xs" padding="md" radius="md">
                  <Text>Give Virtual Money</Text>

                  {summary ? (
                    <Flex align={"baseline"} justify={"flex-start"} mt="3">
                      <Text style={{ fontSize: "3rem" }} c="red">
                        {summary.totalGiveVirtualMoney}
                      </Text>
                      <Text ml="md" fz={"sm"} fw={"unset"}>
                        people
                      </Text>
                    </Flex>
                  ) : (
                    <Text mt="3" style={{ fontSize: "3rem" }}>
                      <Text>Loading...</Text>
                    </Text>
                  )}
                </Card>
              </Grid.Col>

              <Grid.Col span={6}>
                <Card shadow="xs" padding="md" radius="md">
                  <Text>Give Comments</Text>
                  {summary ? (
                    <Flex align={"baseline"} justify={"flex-start"} mt="3">
                      <Text style={{ fontSize: "3rem" }} c="red">
                        {summary.totalGiveComments}
                      </Text>
                      <Text ml="md" fz={"sm"} fw={"unset"}>
                        people
                      </Text>
                    </Flex>
                  ) : (
                    <Text mt="3" style={{ fontSize: "3rem" }}>
                      <Text>Loading...</Text>
                    </Text>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>

        <Grid.Col span={6} h="100%">
          <Card shadow="xs" padding="md" radius="md">
            <Flex align={"baseline"} justify={"flex-start"}>
              <Text size="xl" c={"gray"} fw="bold">
                Total Comments
              </Text>
              <Text ml="sm" size="xs" c={"gray"} fw="bold">
                (จำนวนความคิดเห็นทั้งหมด)
              </Text>
            </Flex>

            <Divider />
            <Grid mt="lg" h="100%">
              <Grid.Col span={6}>
                {summary ? (
                  <Flex align={"baseline"} justify={"flex-start"} mt="3">
                    <Text style={{ fontSize: "3rem" }} c="red">
                      {summary.totalComments}
                    </Text>
                    <Text ml="md" fz={"sm"} fw={"unset"}>
                      comments
                    </Text>
                  </Flex>
                ) : (
                  <Text mt="3" style={{ fontSize: "3rem" }}>
                    <Text>Loading...</Text>
                  </Text>
                )}
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid mt="lg" style={{ display: "flex" }}>
        <Grid.Col span={12}>
          <Card shadow="xs" padding="md" radius="md">
            <Text size="xl" c={"gray"} fw="bold">
              Projects Ranking
            </Text>
            <Divider />
            <Select
              //   label="Select number of projects to show"
              placeholder="Select number of projects to show"
              data={["5", "10", "15", "All"]}
              mt="md"
              defaultValue={"5"}
              onChange={(value) => {
                setSelectedProject(value || "");
              }}
            />
            {summary ? (
              <>
                {summary.projectsRanking
                  .slice(
                    0,
                    selectedProject === "All"
                      ? summary.projectsRanking.length
                      : parseInt(selectedProject)
                  )
                  .map((project, index) => (
                    <Flex
                      align={"baseline"}
                      justify={"space-between"}
                      key={project.id}
                    >
                      <Text size="md" c={"gray"} fw="400">
                        {index + 1}. {project.title}
                      </Text>
                      <Flex align={"baseline"} justify={"flex-end"}>
                        <Text fw="bold" size="lg" c={"gray"}>
                          {project.amount.toLocaleString()}{" "}
                        </Text>
                        <Text ml="md" size="md" c={"gray"} fw="400">
                          {summary.event.unit_money}
                        </Text>
                      </Flex>
                    </Flex>
                  ))}
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>
      <Grid mt="lg" style={{ display: "flex" }}>
        <Grid.Col span={12}>
          <Card shadow="xs" padding="md" radius="md">
            <Text size="xl" c={"gray"} fw="bold">
              Projects Not Ranked
            </Text>
            <Divider />

            {summary ? (
              <>
                {summary.projectsNotRanked.map((project, index) => (
                  <Flex
                    mt="md"
                    align={"baseline"}
                    justify={"space-between"}
                    key={project.id}
                  >
                    <Text size="md" c={"gray"} fw="400">
                      {index + 1}. {project.title}
                    </Text>
                  </Flex>
                ))}
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
