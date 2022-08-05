import { expect, test } from "vitest";
import { getFilePath } from "./filepath";

test("getFilePath", async () => {
  expect(getFilePath(new Date("2022-08-05T00:00:00.000Z"))).toBe("2022/08/05/1659657600000");
  expect(getFilePath(1659657600000)).toBe("2022/08/05/1659657600000");
});
