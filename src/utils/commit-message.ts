import { FileIndex } from "../types";

export const makeCommitMessage = ({
	time,
	title,
	tags = [],
}: { time: Date; title: string; tags?: string[] }) => {
	return [String(time.getTime()), title, ...tags].join(" ");
};

export const parseCommitMessage = (message: string): FileIndex => {
	const [time, title, ...tags] = message.split(" ");

	return {
		time: Number(time),
		title: title ?? "",
		tags,
	};
};
