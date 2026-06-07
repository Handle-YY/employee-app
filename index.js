/**
 * index.js
 * Node.jsでベーシック認証を備えたHTTPサーバーを構築するメインファイル
 * ポート8000番でリクエストを待ち受ける
 */

'use strict';  // 厳格モード

const http = require('http');
const auth = require('http-auth');
const path = require('path');
const router = require('./lib/router');

// ベーシック認証の設定
// users.htpasswdファイルに記録されたユーザー情報をもとに認証を管理する
const basic = auth.basic({
  realm: 'Employee App', // 認証ダイアログに表示される領域名
  file: path.join(__dirname, 'users.htpasswd'), // 認証情報ファイルのパス
});

// HTTPサーバーの作成
const server = http.createServer(
  // ベーシック認証をサーバーに適用する
  basic.check((req, res) => {
    // 認証成功時のみルーティングに処理を引き渡す
    router.route(req, res);
  })
);

// サーバーエラー発生時のエラーハンドリング
server.on('error', (err) => {
  console.error('サーバーエラーが発生しました:', err);
});

// クライアントエラー発生時のエラーハンドリング
server.on('clientError', (err, socket) => {
  console.error('クライアントエラーが発生しました:', err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// ポート8000番でサーバーを起動する
server.listen(8000, () => {
  console.log('サーバーを起動しました: http://localhost:8000');
});