# github-storage

## ローカル開発環境の作り方

リポジトリを clone した後、以下の手順でローカル開発環境を構築する。

1. npm install する
2. .env ファイルを作成する
3. .env ファイルに GitHub トークンを設定する

### 1. npm install する

事前に Node.js のインストールをしておく。

```
node -v  # 18.0.0
npm -v   # 8.6.0
```

### 2. .env ファイルを作成する

ローカル開発時に使う環境変数は.env ファイルで管理しているため、そちらを作成する。

```sh
cp .env.sample .env
```

### 3. .env ファイルに GitHub トークンを設定する

.env ファイルを編集して、GITHUB_TOKEN に GitHub 認証トークン（Personal Access Toke）を設定する。
認証トークンは以下の URL から作成できる。

https://github.com/settings/apps

必要な権限は、`Read and Write access to code` のみで良い。
