import { expect, test } from "vitest";
import { makeFilePath } from "./filepath";

test("makeFilePath", async () => {
  expect(makeFilePath(new Date("2022-08-05T00:00:00.000Z"))).toBe("2022/08/05/1659657600000");
});
