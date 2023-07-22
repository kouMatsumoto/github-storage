export type FileData = {
  time: number;
  title: string;
  text: string;
  tags: string[];
};

export const createFileData = ({
  time,
  title,
  text,
  tags = [],
}: {
  time: Date;
  title: string;
  text: string;
  tags?: string[];
}) => {
  return JSON.stringify({
    time: time.valueOf(),
    title,
    text,
    tags,
  });
};

// TODO: add validation
export const parseFileData = (text: string) => {
  return JSON.parse(text) as FileData;
};
