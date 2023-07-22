import { expect, test } from "vitest";
import { createFileData, parseFileData } from "./filedata";

test("createFileData", async () => {
	const time = new Date("2022-08-05T00:00:00.000Z");
	const title = "title";
	const text = "text";
	const tags = ["t1", "t2"];

	expect(createFileData({ time, title, text, tags })).toBe(
		'{"time":1659657600000,"title":"title","text":"text","tags":["t1","t2"]}',
	);
});

test("parseFileData", async () => {
	expect(
		parseFileData(
			'{"time":1659657600000,"title":"title","text":"text","tags":["t1","t2"]}',
		),
	).toStrictEqual({
		time: 1659657600000,
		title: "title",
		text: "text",
		tags: ["t1", "t2"],
	});
});
