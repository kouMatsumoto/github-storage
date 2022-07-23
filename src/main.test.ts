import { expect, test } from "vitest";
import { main } from "./main";

test("main", () => {
  expect(() => main()).not.toThrow();
});
