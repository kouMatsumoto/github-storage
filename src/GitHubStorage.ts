import { format } from "date-fns";
import { GitHubClient } from "./GitHubClient";

export class GitHubStorage {
  #client: GitHubClient;
  #repository: string;

  constructor({ token, repository }: { token: string; repository: string }) {
    this.#client = new GitHubClient({ token });
    this.#repository = repository;
  }

  async save({ text }: { text: string }) {
    const { user } = await this.#client.getViewer();
    const { defaultBranchName, lastCommitId } = await this.#client.getRepository({
      owner: user,
      name: this.#repository,
    });

    const filepath = getFilePath();

    const res = await this.#client.createCommit({
      branch: {
        repositoryNameWithOwner: `${user}/${this.#repository}`,
        branchName: defaultBranchName,
      },
      expectedHeadOid: lastCommitId,
      fileChanges: {
        additions: [{ path: filepath, contents: toBase64(text) }],
      },
      message: {
        headline: filepath,
      },
    });

    return res;
  }
}

const getFilePath = (time = new Date()) => format(time, `yyyy/MM/dd/${time.getTime()}`);
const toBase64 = (text: string) => btoa(unescape(encodeURIComponent(text)));
