import dayjs from "dayjs";

export function getDuration(startDate: Date, endDate: Date) {
  const startTime = dayjs(startDate);
  const endTime = dayjs(endDate);
  const duration = endTime.diff(startTime);
  return duration;
}
