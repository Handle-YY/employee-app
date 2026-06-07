# employee-app

従業員情報管理アプリ

## 使用技術

- Node.js
- PostgreSQL
- Prisma 5系
- Pug
- Docker

## ファイル構成
employee-app/
├── Dockerfile
├── compose.yaml
├── .gitignore
├── .env                      # DB接続情報（Git管理外）
├── package.json
├── users.htpasswd            # ベーシック認証のユーザー情報
├── index.js                  # サーバーのエントリーポイント
├── README.md
├── lib/
│   ├── router.js             # ルーティング
│   ├── handler-util.js       # 共通エラーハンドラー
│   └── employees-handler.js  # 従業員情報のハンドラー
├── prisma/
│   ├── schema.prisma         # DBテーブルの定義
│   ├── seed.js               # サンプルデータ投入スクリプト
│   └── migrations/           # マイグレーションファイル（自動生成）
└── views/
├── employees.pug         # 従業員一覧ページ
└── new.pug               # 新規登録フォームページ



## 環境構築手順

### 1. コンテナの起動

```bash
docker compose up -d
docker compose exec app bash
```

### 2. パッケージのインストール

```bash
yarn install
```

### 3. マイグレーションの実行
# schema.prisma の内容をデータベースに反映させる
# --name init はこのマイグレーションの名前（初回はinitが慣習）

```bash
npx prisma migrate dev --name init
```

### 4. サンプルデータの投入

```bash
node prisma/seed.js
```

### 5. サーバーの起動

```bash
node index.js
```

## アクセス方法

ブラウザで以下のURLにアクセス

- 従業員一覧：http://localhost:8000/employees
- 新規登録：http://localhost:8000/employees/new
- ログアウト：http://localhost:8000/logout

## ベーシック認証

以下のユーザーでログインできます（練習用のため平文。本来はハッシュ化必須）

| ユーザー名 | パスワード |
|-----------|-----------|
| admin     | admin123  |
| staff1    | pass1234  |

## データベース

### テーブル：Employee

| カラム名   | 型       | 説明                   |
|-----------|----------|-----------------------|
| id        | Int      | 社員ID（自動採番）      |
| name      | String   | 氏名                   |
| department| String   | 部門                   |
| position  | String   | 役職                   |
| hireYear  | Int      | 入社年                 |
| createdAt | DateTime | 登録日時（自動設定）    |
