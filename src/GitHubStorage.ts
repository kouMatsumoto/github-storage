import { filter, isDefined } from "remeda";
import { GitHubClient } from "./GitHubClient";
import {
  makeCommitMessage,
  createFileData,
  getFilePath,
  parseCommitMessage,
  toBase64,
  parseFileData,
  FileData,
} from "./utils";

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

  async load({ count }: { count: number }): Promise<FileData[]> {
    const { username } = await this.#client.getViewer();
    const { defaultBranchName, commits } = await this.#client.getRepositoryCommits({
      owner: username,
      name: this.#repository,
      commitHistoryCount: count,
    });

    const records = await Promise.all(
      commits.map(async ({ message }) => {
        const { time } = parseCommitMessage(message);
        const filepath = getFilePath(time);

        const file = await this.#client.getRepositoryFiles({
          owner: username,
          name: this.#repository,
          expression: `${defaultBranchName}:${filepath}`,
        });

        if (!file) {
          console.error(`[github-storage] file not found: ${filepath}`);
          return undefined;
        }

        try {
          return parseFileData(file.text);
        } catch {
          console.error(`[github-storage] data is not json schema: ${file.text}`);
          return undefined;
        }
      }),
    );

    return filter(records, isDefined);
  }

  async save(
    { title = "", text = "", tags = [], time = new Date() }: {
      title?: string;
      text?: string;
      tags?: string[];
      time?: Date;
    },
  ) {
    const { username } = await this.#client.getViewer();
    const { defaultBranchName, lastCommitId } = await this.#client.getRepositoryCommits({
      owner: username,
      name: this.#repository,
      commitHistoryCount: 0,
    });

    const filepath = getFilePath(time);
    const filedata = createFileData({ time, title, text, tags });
    const commitMessage = makeCommitMessage({ time, title, tags });

    const result = await this.#client.createCommit({
      input: {
        branch: {
          repositoryNameWithOwner: `${username}/${this.#repository}`,
          branchName: defaultBranchName,
        },
        expectedHeadOid: lastCommitId,
        fileChanges: {
          additions: [{ path: filepath, contents: toBase64(filedata) }],
        },
        message: {
          headline: commitMessage,
        },
      },
    });

    return result;
  }
}
