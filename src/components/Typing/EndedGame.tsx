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
import { calculateTypingSpeed } from "./utils/calculateWPM";
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
  const { minutes, seconds } = getDuration(startTime as Date, endTime as Date);
  const { rawWpm, adjWpm } = calculateTypingSpeed(
    correctChar,
    errorChar,
    minutes
  );

  const Accuracy = calculateAccuracy(correctChar, errorChar);

  const errorPercentage = calculateErrorPercentage(correctChar, errorChar);

  return (
    <div className="container mx-auto flex max-w-4xl flex-1 flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setStatus("NotStarted")}
          className="flex flex-col items-center rounded-md p-2 outline-none ring-sand-6 ring-offset-2 hover:bg-sand-3 focus:ring-2"
        >
          <Icon icon="solar:restart-line-duotone" fontSize="2rem" />
          <h6>Restart the test</h6>
        </button>
        <div className="flex justify-center gap-4 text-sand-12">
          <div>
            <h6 className="text-sm">Raw Speed</h6>
            <h2 className="text-4xl font-bold">{rawWpm}</h2>
          </div>
          <div>
            <h6 className="text-sm">Adjusted Speed</h6>
            <h2 className="text-4xl font-bold">{adjWpm}</h2>
          </div>
          <div>
            <h6 className="text-sm">Accuracy</h6>
            <h2 className="text-4xl font-bold">{Accuracy}%</h2>
          </div>
          <div>
            <h6 className="text-sm">Error %</h6>
            <h2 className="text-4xl font-bold">{errorPercentage}%</h2>
          </div>
          <div>
            <h6 className="text-sm">Duration</h6>
            <h2 className="text-4xl font-bold">
              {seconds.toFixed(2)}
              <span>s</span>
            </h2>
          </div>
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
