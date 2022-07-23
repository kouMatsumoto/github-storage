import { expect, test } from "vitest";
import { GraphqlClient } from "./GraphqlClient";

test("gql", async () => {
  const client = new GraphqlClient({ token: process.env.GITHUB_TOKEN ?? "" });
  const res = await client.getRepositoryLastCommitId({
    owner: "koumatsumoto",
    name: "github-storage",
  });

  expect(res).toStrictEqual({
    defaultBranchName: expect.any(String),
    lastCommitId: expect.any(String),
  });
});
