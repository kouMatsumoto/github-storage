import { GraphQLClient } from "graphql-request";
import { getSdk } from "./graphql/client";
import { z } from "zod";

export class GitHubClient {
  #client: ReturnType<typeof getSdk>;

  constructor({ token }: { token: string }) {
    this.#client = getSdk(
      new GraphQLClient("https://api.github.com/graphql", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    );
  }

  async getViewer() {
    const data = await this.#client.GetViewer().then(
      z.object({
        viewer: z.object({
          login: z.string(),
          name: z.string(),
        }),
      }).parse,
    );

    return {
      user: data.viewer.login,
      name: data.viewer.name,
    } as const;
  }

  async getRepository(params: { owner: string; name: string }) {
    const data = await this.#client.GetRepository(params).then(
      z.object({
        repository: z.object({
          defaultBranchRef: z.object({
            name: z.string(),
            target: z.object({
              oid: z.string(),
            }),
          }),
        }),
      }).parse,
    );

    return {
      defaultBranchName: data.repository.defaultBranchRef.name,
      lastCommitId: data.repository.defaultBranchRef.target.oid,
    } as const;
  }

  async createCommit(
    params: {
      branch: {
        repositoryNameWithOwner: string;
        branchName: string;
      };
      expectedHeadOid: string;
      fileChanges: {
        additions: [{ path: string; contents: string }];
      };
      message: {
        headline: string;
        body?: string;
      };
    },
  ) {
    const data = await this.#client.CreateCommit({ input: params });

    return data;
  }
}
