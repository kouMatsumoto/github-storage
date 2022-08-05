import { format } from "date-fns";
import { GitHubClient } from "./GitHubClient";

export class GitHubStorage {
  readonly #client: GitHubClient;
  readonly #repository: string;

  constructor({ token, repository }: { token: string; repository: string }) {
    this.#client = new GitHubClient({ token });
    this.#repository = repository;
  }

  async userinfo() {
    return this.#client.getViewer();
  }

  async load({ count }: { count: number }) {
    const { username } = await this.#client.getViewer();
    const { defaultBranchName, commits } = await this.#client.getRepositoryCommits({
      owner: username,
      name: this.#repository,
      commitHistoryCount: count,
    });

    return await Promise.all(
      commits.map(async ({ message: filepath }) => {
        const file = await this.#client.getRepositoryFiles({
          owner: username,
          name: this.#repository,
          expression: `${defaultBranchName}:${filepath}`,
        });

        if (!file) {
          throw new Error("file must be found");
        }

        return {
          time: filepath.split("/").at(-1),
          text: file.text,
        } as const;
      }),
    );
  }

  async save({ text }: { text: string }) {
    const { username } = await this.#client.getViewer();
    const { defaultBranchName, lastCommitId } = await this.#client.getRepositoryCommits({
      owner: username,
      name: this.#repository,
      commitHistoryCount: 0,
    });

    const filepath = getFilePath();

    const result = await this.#client.createCommit({
      input: {
        branch: {
          repositoryNameWithOwner: `${username}/${this.#repository}`,
          branchName: defaultBranchName,
        },
        expectedHeadOid: lastCommitId,
        fileChanges: {
          additions: [{ path: filepath, contents: toBase64(text) }],
        },
        message: {
          headline: filepath,
        },
      },
    });

    return result;
  }
}

const getFilePath = (time = new Date()) => `${format(time, "yyyy/MM/dd")}/${time.getTime()}`;
const toBase64 = (text: string) => btoa(unescape(encodeURIComponent(text)));
