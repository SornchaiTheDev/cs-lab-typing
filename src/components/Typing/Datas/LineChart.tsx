import type { typing_histories } from "@prisma/client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { useMemo } from "react";

interface Props {
  datas: typing_histories[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);
function LineChart({ datas }: Props) {
  const data = useMemo(
    () => ({
      labels: datas.map((_, i) => i + 1),
      datasets: [
        {
          label: "Typing Speed (wpm)",
          data:
            datas
              .sort((a, b) => a.adjusted_speed - b.adjusted_speed)
              .map(({ adjusted_speed }) => adjusted_speed) ?? [], // Replace with your actual data
          backgroundColor: "#e3e3e0", // Background color of the line
          borderColor: "#1b1b18", // Border color of the line
          borderWidth: 2, // Border width of the line
        },
      ],
    }),
    [datas]
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {},
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: (value) => value,
          stepSize: 10,
          sampleSize: 10,
        },
      },
    },
  };

  return <Line options={options} data={data} />;
}

export default LineChart;
