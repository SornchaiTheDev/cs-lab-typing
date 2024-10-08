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
import useTheme from "~/hooks/useTheme";
import type { TypingHistoryOmitScore } from "~/types";

interface Props {
  datas: TypingHistoryOmitScore[];
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
  const { theme } = useTheme();
  const data = useMemo(
    () => ({
      labels: datas.map((_, i) => i + 1),
      datasets: [
        {
          label: "Typing Speed (wpm)",
          data:
            [...datas]
              .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
              .map(({ adjusted_speed }) => adjusted_speed) ?? [], // Replace with your actual data
          backgroundColor: theme === "light" ? "#e3e3e0" : "#80807a", // Background color of the line
          borderColor: theme === "light" ? "#1b1b18" : "#fdfdfc", // Border color of the line
          borderWidth: 2, // Border width of the line
        },
      ],
    }),
    [datas, theme]
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
