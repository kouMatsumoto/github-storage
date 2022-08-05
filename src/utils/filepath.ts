import { format } from "date-fns";

export const makeFilePath = (time = new Date()) => `${format(time, "yyyy/MM/dd")}/${time.getTime()}`;
