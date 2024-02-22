import axios from "axios";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale } from "chart.js";
import { Flex, Text, RadioGroup, Radio, Group, Space } from "@mantine/core";

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

  Chart.register(CategoryScale);

  const [numberOfBars, setNumberOfBars] = useState<number>(3);

  const handleSelectChange = (value: number) => {
    setNumberOfBars(value);
  };

  const _Data = {
    labels: eventResult?.map((data) => data.title).slice(0, numberOfBars),
    datasets: [
      {
        label: "Virtual Money ",
        data: eventResult
          ?.map((data) => data.total_virtual_money)
          .slice(0, numberOfBars),
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
  };

  const chartContent = (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Event Result</h2>
      <Bar
        data={_Data}
        options={{
          plugins: {
            title: {
              display: true,
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );

  const [chartDataColumn, setChartDataColumn] = useState<number>(3);

  return (
    <div>
      <Flex justify="center">
        {eventResult ? (
          <div>
            <RadioGroup
              value={chartDataColumn.toString()}
              onChange={(value) => setChartDataColumn(Number(value))}
              label="Number of Bars"
              required
              withAsterisk
            >
              <Group mt="xs" color="red">
                <Space h="lg" />
                <Radio
                  value="3"
                  label="Top 3 teams"
                  onClick={() => handleSelectChange(3)}
                />
                <Radio
                  value="5"
                  label="Top 5 teams"
                  onClick={() => handleSelectChange(5)}
                />
              </Group>
            </RadioGroup>
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
