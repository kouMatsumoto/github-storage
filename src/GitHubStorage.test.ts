import { GitHubStorage } from "./GitHubStorage";
import { expect, test, describe } from "vitest";

describe("GitHubStorage", () => {
  const storage = new GitHubStorage({ token: process.env.GITHUB_TOKEN ?? "", repository: "github-storage-test" });

  test("save", async () => {
    const data = await storage.save({ text: "hello" });

    expect(data).toStrictEqual({});
  });
});
