import { GraphQLClient } from "graphql-request";
import { expect, test } from "vitest";
import { getSdk } from "./client";

test("gql", async () => {
  const client = getSdk(
    new GraphQLClient("https://api.github.com/graphql", {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }),
  );

  const { repository } = await client.GetRepository({
    owner: "koumatsumoto",
    name: "github-storage",
  });

  expect(repository).toStrictEqual({
    defaultBranchRef: {
      name: expect.any(String),
      target: {
        oid: expect.any(String),
      },
    },
  });
});
