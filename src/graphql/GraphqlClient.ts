import { graphql } from "@octokit/graphql";

const QUERY_REPO_LAST_COMMIT_ID = `
  query GetRepositoryLastCommitId($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        name
        target {
          ... on Commit {
            oid
          }
        }
      }
    }
  }
` as const;

export class GraphqlClient {
  #graphql: typeof graphql;

  constructor({ token }: { token: string }) {
    this.#graphql = graphql.defaults({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  async getRepositoryLastCommitId(params: { owner: string; name: string }) {
    const { repository } = (await this.#graphql(QUERY_REPO_LAST_COMMIT_ID, params)) as {
      repository: {
        defaultBranchRef: {
          name: string;
          target: {
            oid: string;
          };
        };
      };
    };

    return {
      defaultBranchName: repository.defaultBranchRef.name,
      lastCommitId: repository.defaultBranchRef.target.oid,
    } as const;
  }
}
