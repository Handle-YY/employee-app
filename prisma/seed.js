/**
 * データベースにサンプルデータを投入するスクリプト
 * 実行コマンド: npm run seed（コンテナ内で実行）
 */

const { PrismaClient } = require('@prisma/client');

// Prisma Clientのインスタンスを生成
const prisma = new PrismaClient();

/**
 * サンプルデータを登録するメイン関数
 */
async function main() {
  // 既存データを一度削除してからサンプルデータを投入する
  await prisma.employee.deleteMany();

  // サンプル従業員データの登録
  await prisma.employee.createMany({
    data: [
      { name: '田中 太郎', department: '開発部', position: '課長',   hireYear: 2015 },
      { name: '鈴木 花子', department: '営業部', position: '一般',   hireYear: 2021 },
      { name: '佐藤 次郎', department: '人事部', position: '主任',   hireYear: 2018 },
      { name: '高橋 三郎', department: '開発部', position: '一般',   hireYear: 2023 },
      { name: '伊藤 四郎', department: '営業部', position: '課長',   hireYear: 2012 },
      { name: '渡辺 五郎', department: '人事部', position: '一般',   hireYear: 2022 },
    ],
  });

  console.log('サンプルデータの投入が完了しました！');
}

// メイン関数を実行し、エラーがあれば表示して終了
main()
  .catch((e) => {
    console.error('サンプルデータの投入に失敗しました:', e);
    process.exit(1);
  })
  .finally(async () => {
    // 処理完了後にDBとの接続を切断する
    await prisma.$disconnect();
  });