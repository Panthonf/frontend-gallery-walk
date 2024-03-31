import { Card, Divider, Flex, Grid, Text, Title } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function EventSummary(props: { eventId: React.ReactNode }) {
  const [summary, setSummary] = useState<{
    totalProjects: number;
    totalGiveVirtualMoney: number;
    totalGiveComments: number;
    totalVirtualMoney: number;
    event: {
        id: number;
        unit_money: string;
    }
  } | null>(null);

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

      <Grid mt="lg" style={{ display: "flex" }}>
        <Grid.Col span={6}>
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
            <Grid mt="lg" style={{ display: "flex" }}>
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
      </Grid>
    </div>
  );
}
