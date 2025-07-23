import dayjs from "dayjs";

export const convertToBackendDate = (date: string) => {
  return dayjs(date).format("DD-MM-YYYY");
};
