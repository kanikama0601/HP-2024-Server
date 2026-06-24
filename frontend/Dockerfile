FROM node:20-slim

WORKDIR /app

# 依存関係のインストール
COPY package.json package-lock.json* ./
RUN npm ci --quiet

# ソースコードのコピー
COPY . .

# ポート3000で起動
EXPOSE 3000

# Vite 開発サーバー起動（host: true は vite.config.ts で設定済み）
CMD ["npm", "run", "dev"]
