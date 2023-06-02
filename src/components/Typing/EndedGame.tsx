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
import { useEffect, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTypingStore } from "~/store";
import { getDuration } from "./utils/getDuration";
import { calculateTypingSpeed } from "./utils/calculateWPM";
import { calculateErrorPercentage } from "./utils/calculateErrorPercentage";
import { Icon } from "@iconify/react";
import Stats from "./Stats";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import type { typing_histories } from "@prisma/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

function EndedGame() {
  const [stats, setStatus] = useTypingStore((state) => [
    state.stats,
    state.setStatus,
  ]);

  const options = {
    responsive: true,
    plugins: {},
    maintainAspectRatio: false,
  };
  const columnHelper = createColumnHelper<typing_histories>();

  const router = useRouter();
  const { sectionId, labId, taskId } = router.query;

  const sectionIdInt = parseInt(sectionId as string);
  const labIdInt = parseInt(labId as string);
  const taskIdInt = parseInt(taskId as string);

  const typingHistories = trpc.front.getTypingHistory.useQuery({
    sectionId: sectionIdInt,
    taskId: taskIdInt,
  });

  const highestSpeed = useMemo(() => {
    if (typingHistories.data) {
      const highestSpeed = typingHistories.data.reduce((prev, current) => {
        return prev.adjusted_speed > current.adjusted_speed ? prev : current;
      });
      return highestSpeed.adjusted_speed;
    }
    return 0;
  }, [typingHistories.data]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "round",
        size: 10,
        cell: (props) => {
          if (props.row.original.adjusted_speed === highestSpeed)
            return (
              <div className="w-fit rounded-full bg-yellow-3 p-2 text-xl text-yellow-10">
                <Icon icon="ph:trophy-duotone" />
              </div>
            );
          return null;
        },
      }),
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
        cell: (props) => {
          const { minutes, seconds } = getDuration(
            props.row.original.started_at,
            props.row.original.ended_at
          );

          if (seconds > 60) return minutes + "m";
          return seconds + "s";
        },
      }),
      {
        header: "% Error",
        accessorKey: "percent_error",
        cell: (props) => props.getValue() + "%",
      },
    ],
    [columnHelper]
  );

  const submitTyping = trpc.front.submitTyping.useMutation();

  useEffect(() => {
    const saveTypingScore = async () => {
      if(!stats) return;
      if(!labIdInt) return;
      if(!sectionIdInt) return;
      if(!taskIdInt) return;

      const { errorChar, startedAt, endedAt, totalChars } = stats;
      const { minutes } = getDuration(startedAt as Date, endedAt as Date);
      const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
        totalChars,
        errorChar,
        minutes
      );
      const percentError = calculateErrorPercentage(totalChars, errorChar);
      await submitTyping.mutateAsync({
        sectionId: sectionIdInt,
        labId: labIdInt,
        taskId: taskIdInt,
        rawSpeed,
        adjustedSpeed,
        percentError,
        startedAt: startedAt as Date,
        endedAt: endedAt as Date,
      });
      await typingHistories.refetch();
    };
    saveTypingScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = {
    labels: typingHistories.data?.map((_, i) => i + 1),
    datasets: [
      {
        label: "Typing Speed (wpm)",
        data:
          typingHistories.data?.map(({ adjusted_speed }) => adjusted_speed) ??
          [], // Replace with your actual data
        backgroundColor: "#e3e3e0", // Background color of the line
        borderColor: "#1b1b18", // Border color of the line
        borderWidth: 2, // Border width of the line
      },
    ],
  };

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
        <Stats />
        <div className="w-full flex-1">
          <Line options={options} data={data} />
        </div>
      </div>
      <Table
        isLoading={typingHistories.isLoading}
        data={typingHistories.data ?? []}
        columns={columns}
      />
    </div>
  );
}

export default EndedGame;
