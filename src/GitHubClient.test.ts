import { GitHubClient } from "./GitHubClient";
import { expect, test, describe } from "vitest";

describe("GitHubClient", () => {
  const client = new GitHubClient({ token: process.env.GITHUB_TOKEN ?? "" });

  test("getViewer", async () => {
    const data = await client.getViewer();

    expect(data).toStrictEqual({
      user: expect.any(String),
      name: expect.any(String),
    });
  });

  test("getRepository", async () => {
    const data = await client.getRepository({ owner: "koumatsumoto", name: "github-storage" });

    expect(data).toStrictEqual({
      defaultBranchName: expect.any(String),
      lastCommitId: expect.any(String),
    });
  });
});
