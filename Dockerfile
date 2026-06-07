# ベースイメージ：Node.js 22.22.0 の公式イメージを使用
FROM node:22.22.0

# 必要パッケージのインストールと日本語環境の設定
RUN apt-get update && apt-get install -y \
  curl \
  tmux \
  locales \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8

# 環境変数：言語・タイムゾーンを日本に設定
ENV LANG=ja_JP.UTF-8
ENV TZ=Asia/Tokyo

# 作業ディレクトリの指定（以降のコマンドはここを基準に実行される）
WORKDIR /app
