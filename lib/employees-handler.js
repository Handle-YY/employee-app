/**
 * employees-handler.js
 * 従業員情報（/employees）へのリクエスト処理を担当するハンドラーファイル
 */

'use strict';   // 厳格モード

const { PrismaClient } = require('@prisma/client');
const pug = require('pug');
const path = require('path');
const util = require('./handler-util');

// Prisma Clientのインスタンスを生成
const prisma = new PrismaClient();

/**
 * 現在の年から入社年を引いて勤続年数を計算する
 * @param {number} hireYear - 入社年
 * @returns {number} 勤続年数
 */
function calcYearsOfService(hireYear) {
  const currentYear = new Date().getFullYear();
  return currentYear - hireYear;
}

/**
 * /employeesへのリクエストを処理するメイン関数
 * GETとPOSTメソッドに応じて処理を振り分ける
 * @param {http.IncomingMessage} req - リクエストオブジェクト
 * @param {http.ServerResponse} res - レスポンスオブジェクト
 */
async function handle(req, res) {
  if (req.method === 'GET') {
    await handleGet(req, res);
  } else if (req.method === 'POST') {
    await handlePost(req, res);
  } else {
    util.handleBadRequest(req, res);
  }
}

/**
 * GETリクエストの処理
 * URLのクエリパラメータを使って部門・役職でフィルタリングし、一覧を表示する
 * @param {http.IncomingMessage} req - リクエストオブジェクト
 * @param {http.ServerResponse} res - レスポンスオブジェクト
 */
async function handleGet(req, res) {
  // URLからクエリパラメータを取得する（例: /employees?department=開発部）
  const url = new URL(req.url, `http://${req.headers.host}`);
  const department = url.searchParams.get('department') || '';
  const position = url.searchParams.get('position') || '';

  // フィルタリング条件を組み立てる
  const where = {};
  if (department) where.department = department;
  if (position) where.position = position;

  // データベースから従業員一覧を取得する
  const employees = await prisma.employee.findMany({
    where,
    orderBy: { id: 'asc' },
  });

  // 勤続年数を各従業員データに追加する
  const employeesWithYears = employees.map((emp) => ({
    ...emp,
    yearsOfService: calcYearsOfService(emp.hireYear),
  }));

  console.log(`従業員一覧を表示しました（${employeesWithYears.length}件）`);

  // Pugテンプレートを使ってHTMLを生成し、レスポンスとして返す
  const html = pug.renderFile(
    path.join(__dirname, '..', 'views', 'employees.pug'),
    {
      employees: employeesWithYears,
      department,
      position,
    }
  );

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

/**
 * POSTリクエストの処理
 * フォームから送信された従業員情報をデータベースに登録する
 * @param {http.IncomingMessage} req - リクエストオブジェクト
 * @param {http.ServerResponse} res - レスポンスオブジェクト
 */
async function handlePost(req, res) {
  // リクエストボディのデータを受け取る
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    // URLエンコードされたフォームデータをパースする
    const params = new URLSearchParams(body);
    const name = params.get('name');
    const department = params.get('department');
    const position = params.get('position');
    const hireYear = parseInt(params.get('hireYear'));

    // データベースに新規従業員を登録する
    await prisma.employee.create({
      data: { name, department, position, hireYear },
    });

    console.log(`従業員を登録しました: ${name}`);

    // 二重送信を防ぐためにリダイレクトする（303 See Other）
    res.writeHead(303, { Location: '/employees' });
    res.end();
  });
}

/**
 * GETリクエストの処理（新規登録フォームの表示）
 * /employees/new へのアクセス時に登録フォームを返す
 * @param {http.IncomingMessage} req - リクエストオブジェクト
 * @param {http.ServerResponse} res - レスポンスオブジェクト
 */
async function handleNew(req, res) {
  if (req.method === 'GET') {
    const html = pug.renderFile(
      path.join(__dirname, '..', 'views', 'new.pug')
    );
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else {
    util.handleBadRequest(req, res);
  }
}

// 他のファイルから呼び出せるようにエクスポート
module.exports = { handle, handleNew };