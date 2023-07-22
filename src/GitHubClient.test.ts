import { GitHubClient } from "./GitHubClient";
import { expect, test, describe } from "vitest";

describe("GitHubClient", () => {
	const client = new GitHubClient({ token: process.env.GITHUB_TOKEN ?? "" });

	test("getViewer", async () => {
		const data = await client.getViewer();

		expect(data).toStrictEqual({
			username: expect.any(String),
			name: expect.any(String),
			avatarUrl: expect.any(String),
		});
	});

	test("getRepositoryDefaultBranch", async () => {
		const data = await client.getRepositoryDefaultBranch({
			owner: "koumatsumoto",
			name: "github-storage-test",
		});

		expect(data).toStrictEqual("main");
	});

	test("getRepositoryCommits", async () => {
		const data = await client.getRepositoryCommits({
			owner: "koumatsumoto",
			name: "github-storage-test",
			count: 2,
		});

		expect(data).toStrictEqual({
			defaultBranchName: expect.any(String),
			lastCommitId: expect.any(String),
			commits: expect.any(Array),
			totalCount: expect.any(Number),
			endCursor: expect.any(String),
			hasNextPage: expect.any(Boolean),
		});
	});

	test("getRepositoryFile", async () => {
		const data = await client.getRepositoryFile({
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
