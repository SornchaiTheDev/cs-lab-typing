import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import Table from "../Common/Table";
import { useMemo } from "react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useTypingStore } from "~/store";
import { calculateAccuracy } from "./utils/calculateAccuracy";
import { getDuration } from "./utils/getDuration";
import { calculateWPM } from "./utils/calculateWPM";
import { calculateErrorPercentage } from "./utils/calculateErrorPercentage";
import { Icon } from "@iconify/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

interface HistoryRow {
  round: number;
  raw_speed: number;
  adjusted_speed: number;
  start_time: Date;
  end_time: Date;
  error_percentage: number;
}

function EndedGame() {
  const [stats, setStatus] = useTypingStore((state) => [
    state.stats,
    state.setStatus,
  ]);
  const { correctChar, errorChar, startTime, endTime } = stats;
  const options = {
    responsive: true,
    plugins: {},
    maintainAspectRatio: false,
  };
  const columnHelper = createColumnHelper<HistoryRow>();

  const data = {
    labels: [1, 2, 3, 4, 5],
    datasets: [
      {
        label: "Typing Speed (wpm)",
        data: [60, 70, 80, 75, 90], // Replace with your actual data
        backgroundColor: "#e3e3e0", // Background color of the line
        borderColor: "#1b1b18", // Border color of the line
        borderWidth: 2, // Border width of the line
      },
    ],
  };

  const columns = useMemo<ColumnDef<HistoryRow, string | { email: string }>[]>(
    () => [
      {
        header: "Round",
        accessorKey: "round",
        size: 40,
      },
      {
        header: "Raw Speed",
        accessorKey: "raw_speed",
      },
      {
        header: "Adjusted Speed",
        accessorKey: "adjusted_speed",
      },
      columnHelper.display({
        id: "duration",
        header: "Duration",
        cell: (props) => <span>Test</span>,
      }),
      {
        header: "% Error",
        accessorKey: "error_percentage",
      },
    ],
    [columnHelper]
  );
  const duration = getDuration(startTime as Date, endTime as Date);
  const WPM = calculateWPM(correctChar, errorChar, duration);

  const Accuracy = calculateAccuracy(correctChar, errorChar);

  const errorPercentage = calculateErrorPercentage(correctChar, errorChar);

  return (
    <div className="container mx-auto flex max-w-4xl flex-1 flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setStatus("NotStarted")}
          className="flex flex-col items-center rounded-md p-2 hover:bg-sand-3 outline-none focus:ring-2 ring-offset-2 ring-sand-6"
        >
          <Icon icon="solar:restart-line-duotone" fontSize="2rem" />
          <h6>Restart the test</h6>
        </button>
        <div className="flex justify-center gap-2 text-sand-12">
          <h6>WPM</h6>
          <h2 className="text-6xl font-bold">{WPM}</h2>
          <h6>Accuracy</h6>
          <h2 className="text-6xl font-bold">{Accuracy}%</h2>
          <h6>Error %</h6>
          <h2 className="text-6xl font-bold">{errorPercentage}%</h2>
        </div>
        <div className="w-full flex-1">
          <Line options={options} data={data} />
        </div>
      </div>
      <Table
        data={[
          {
            round: 1,
            raw_speed: 55,
            adjusted_speed: 50,
            start_time: new Date(),
            end_time: new Date(),
            error_percentage: 2.5,
          },
        ]}
        columns={columns}
      />
    </div>
  );
}

export default EndedGame;
