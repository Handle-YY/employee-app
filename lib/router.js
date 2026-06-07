/**
 * router.js
 * クライアントからのリクエストURLに応じて
 * 適切なハンドラーに処理を振り分けるルーティングファイル
 */

'use strict';   // 厳格モード

const employeesHandler = require('./employees-handler');
const util = require('./handler-util');

/**
 * リクエストURLを判定して適切なハンドラーに処理を渡す
 * @param {http.IncomingMessage} req - リクエストオブジェクト
 * @param {http.ServerResponse} res - レスポンスオブジェクト
 */
function route(req, res) {
  // URLのパス部分のみを取得する（クエリパラメータを除く）
  // 例: /employees?department=開発部 → /employees
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  switch (pathname) {
    case '/employees':
      // 従業員一覧・登録の処理
      employeesHandler.handle(req, res);
      break;
    case '/employees/new':
      // 従業員新規登録フォームの表示
      employeesHandler.handleNew(req, res);
      break;
    case '/logout':
      // ログアウト処理
      util.handleLogout(req, res);
      break;
    default:
      // 該当するURLがない場合は404エラー
      util.handleNotFound(req, res);
      break;
  }
}

// 他のファイルから呼び出せるようにエクスポート
module.exports = { route };