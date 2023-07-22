import { format } from "date-fns";
import { isDate } from "remeda";

export const getFilePath = (time: number | Date) => {
  const date = isDate(time) ? time : new Date(time);

  return `${format(time, "yyyy/MM/dd")}/${date.getTime()}`;
};
