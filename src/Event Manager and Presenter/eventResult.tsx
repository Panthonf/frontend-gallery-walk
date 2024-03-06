import axios from "axios";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale } from "chart.js";
import {
  Flex,
  Text,
  // RadioGroup, Radio, Group, Space
} from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";

import { TableSort } from "../components/tableSort";

type EventResultType = {
  id: number;
  title: string;
  total_virtual_money: number;
  description: string;
  created_at: string;
};

export default function EventResult(props: { eventId: unknown }) {
  const [eventResult, setEventResult] = useState<EventResultType[] | null>(
    null
  );

  useEffect(() => {
    const fetchProjectResult = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_ENDPOINTMENT}events/event-result/${
            props.eventId
          }`,
          {
            withCredentials: true,
          }
        );
        console.log("event result", res.data.data);
        setEventResult(res.data.data);
      } catch (err) {
        console.error("Error fetching event result:", err);
      }
    };
    fetchProjectResult();
  }, [props.eventId]);

  Chart.register(CategoryScale);

  const chartContent = eventResult ? (
    <div className="chart-container">
      <h2
        style={{
          textAlign: "center",
          color: "grey",
          fontFamily: "sans-serif",
          fontWeight: 800,
        }}
      >
        Event Result
        <span style={{ marginLeft: "8px" }}></span>
        <IconChartBar size={20} />
      </h2>
      <Bar
        data={{
          labels: [
            `2nd-${eventResult[1].title}`,
            `1st-${eventResult[0].title}`,
            `3rd-${eventResult[2].title}`,
          ],
          datasets: [
            {
              label: "Virtual Money ",
              data: ["100", "150", "100"],
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderColor: "black",
              borderWidth: 2,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              display: false,
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            title: {
              display: true,
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function () {
                  return '';
                },
              },
            },
          },
        }}
      />
    </div>
  ) : null;

  return (
    <div>
      <Flex justify="center">
        {eventResult ? (
          <div>
            {chartContent}
            <TableSort data={eventResult} />
          </div>
        ) : (
          <Text size="lg" c="redcolor.4" fw={500}>
            No data available
          </Text>
        )}
      </Flex>
    </div>
  );
}
