import axios from "axios";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Flex,
  // Select,
  Text,
} from "@mantine/core";
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
  //   const [numberOfBars, setNumberOfBars] = useState<number>(3);

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

  //   const filteredEventResult = eventResult && eventResult.slice(0, numberOfBars);
  //   const dataChart = filteredEventResult?.map(
  //     (result) => result.total_virtual_money
  //   );

  const chartData = {
    labels: [
      `2nd (${eventResult?.[1].title ?? 0})`,
      `1st (${eventResult?.[0].title ?? 0})`,
      `3rd (${eventResult?.[2].title ?? 0})`,
    ],
    datasets: [
      {
        label: "Total Virtual Money",
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderColor: "#fff",
        borderWidth: 1,
        data: [30, 50, 30],
      },
    ],
    legend: {
      display: false,
    },
  };

  let delayed: boolean;

  const chartOptions = {
    indexAxis: "x" as const,
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        beginAtZero: true,
        // display: false,
      },
      y: {
        beginAtZero: true,
        display: false,
      },
    },

    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context: {
        type: string;
        mode: string;
        dataIndex: number;
        datasetIndex: number;
      }) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
  };

  //   const handleSelectChange = (value: number) => {
  //     setNumberOfBars(value);
  //   };

  const chartContent = (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Event Result</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );

  return (
    <div>
      <Flex my="80" justify="center">
        {eventResult ? (
          <div>
            {/* <Flex justify="flex-end">
              <Select
                label="Number of Bars"
                placeholder="Select number of bars"
                data={["1", "3", "5", "10"]}
                defaultValue="3"
                clearable
                value={numberOfBars.toString()}
                onChange={(value) => handleSelectChange(Number(value))}
              />
            </Flex> */}
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
