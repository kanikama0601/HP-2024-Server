FROM node:20-slim

WORKDIR /app

# 依存関係のインストールをビルド時に行い、実行時の負荷を最小化
COPY package.json package-lock.json* ./
RUN npm ci --quiet

# ソースコードのコピー
COPY . .

# 不要な機能を無効化
ENV NEXT_TELEMETRY_DISABLED 1

# ポート3000で起動
EXPOSE 3000

# 開発サーバー起動
CMD ["npm", "run", "dev"]
