export const convertToCompact = (data: string | number) => {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
  });
  return formatter.format(Number(data));
};
