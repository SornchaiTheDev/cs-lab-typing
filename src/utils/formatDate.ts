import dayjs from "dayjs";

export const formatDate = (date: Date, format: string) => {
  return dayjs(date).format(format);
};
