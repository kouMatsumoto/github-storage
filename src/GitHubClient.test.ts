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

  test("getRepositoryCommits", async () => {
    const data = await client.getRepositoryCommits({
      owner: "koumatsumoto",
      name: "github-storage-test",
      commitHistoryCount: 2,
    });

    expect(data).toStrictEqual({
      defaultBranchName: expect.any(String),
      lastCommitId: expect.any(String),
      commits: expect.any(Array),
    });
  });

  test("getRepositoryFiles", async () => {
    const data = await client.getRepositoryFiles({
      owner: "koumatsumoto",
      name: "github-storage-test",
      expression: "main:2022/07/30/1659137075200",
    });

    expect(data).toStrictEqual({
      byteSize: 5,
      text: "hello",
    });
  });
});
