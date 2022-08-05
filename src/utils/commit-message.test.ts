import { expect, test } from "vitest";
import { makeCommitMessage, parseCommitMessage } from "./commit-message";

test("makeCommitMessage", async () => {
  const time = new Date("2022-08-05T00:00:00.000Z");
  const title = "title";
  const tags = ["t1", "t2"];

  expect(makeCommitMessage({ time, title, tags })).toBe("1659657600000 title t1 t2");
});

test("parseCommitMessage", async () => {
  expect(parseCommitMessage("1659657600000 title t1 t2")).toStrictEqual({
    time: 1659657600000,
    title: "title",
    tags: ["t1", "t2"],
  });
  expect(parseCommitMessage("1659657600000")).toStrictEqual({
    time: 1659657600000,
    title: "",
    tags: [],
  });
});
