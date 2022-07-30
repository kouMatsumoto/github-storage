import { GraphQLClient } from "graphql-request";
import { getSdk } from "./graphql/client";
import { z } from "zod";

export class GitHubClient {
  #client: GeneratedClient;

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
          login: z.string().min(1),
          name: z.string().min(1),
        }),
      }).parse,
    );

    return {
      user: data.viewer.login,
      name: data.viewer.name,
    } as const;
  }

  async getRepositoryCommits(params: Params<"GetRepositoryCommits">) {
    const data = await this.#client.GetRepositoryCommits(params).then(
      z.object({
        repository: z.object({
          defaultBranchRef: z.object({
            name: z.string().min(1),
            target: z.object({
              oid: z.string().min(1),
              history: z.object({
                nodes: z.array(
                  z.object({
                    message: z.string().min(1),
                  }),
                ),
              }),
            }),
          }),
        }),
      }).parse,
    );

    return {
      defaultBranchName: data.repository.defaultBranchRef.name,
      lastCommitId: data.repository.defaultBranchRef.target.oid,
      commits: data.repository.defaultBranchRef.target.history.nodes,
    } as const;
  }

  async getRepositoryFiles(params: Params<"GetRepositoryFiles">) {
    const data = await this.#client.GetRepositoryFiles(params).then(
      z.object({
        repository: z.object({
          object: z.object({
            text: z.string(),
            byteSize: z.number(),
          }).nullish(),
        }),
      }).parse,
    );

    return data.repository.object ? (
      {
        text: data.repository.object.text,
        byteSize: data.repository.object.byteSize,
      } as const
    ) : null;
  }

  async createCommit(params: Params<"CreateCommit">) {
    const data = await this.#client.CreateCommit(params).then(
      z.object({
        createCommitOnBranch: z.object({
          commit: z.object({
            oid: z.string().min(1),
          }),
        }),
      }).parse,
    );

    return {
      lastCommitId: data.createCommitOnBranch.commit.oid,
    } as const;
  }
}

type GeneratedClient = ReturnType<typeof getSdk>;
type Params<Method extends keyof GeneratedClient> = Parameters<GeneratedClient[Method]>[0];
