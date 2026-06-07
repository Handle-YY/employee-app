/**
 * handler-util.js
 * Webサーバーで共通して使うレスポンス処理をまとめたユーティリティファイル
 */

'use strict';   // 厳格モード

/**
 * ログアウト処理
 * ステータスコード401（未認証）を返すことで、ブラウザの認証情報をリセットさせる
 * @param {http.IncomingMessage} req - リクエストオブジェクト
 * @param {http.ServerResponse} res - レスポンスオブジェクト
 */
function handleLogout(req, res) {
  res.writeHead(401, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ログアウトしました');
}

/**
 * 404エラー処理
 * 存在しないURLへのアクセス時にステータスコード404を返す
 * @param {http.IncomingMessage} req - リクエストオブジェクト
 * @param {http.ServerResponse} res - レスポンスオブジェクト
 */
function handleNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ページが見つかりません');
}

/**
 * 400エラー処理
 * 対応していないHTTPメソッドでのアクセス時にステータスコード400を返す
 * @param {http.IncomingMessage} req - リクエストオブジェクト
 * @param {http.ServerResponse} res - レスポンスオブジェクト
 */
function handleBadRequest(req, res) {
  res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('不正なリクエストです');
}

// 他のファイルから呼び出せるようにエクスポート
module.exports = { handleLogout, handleNotFound, handleBadRequest };