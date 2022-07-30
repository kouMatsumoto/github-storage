import { GitHubStorage } from "./GitHubStorage";
import { expect, test, describe } from "vitest";

describe("GitHubStorage", () => {
  const storage = new GitHubStorage({ token: process.env.GITHUB_TOKEN ?? "", repository: "github-storage-test" });

  test("save", async () => {
    const data = await storage.save({ text: "hello" });

    expect(data).toStrictEqual({
      lastCommitId: expect.any(String),
    });
  });

  test("load", async () => {
    const data = await storage.load({ count: 1 });

    expect(data).toStrictEqual([
      {
        time: expect.any(String),
        text: expect.any(String),
      },
    ]);
  });
});
