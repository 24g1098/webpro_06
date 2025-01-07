"use strict";

const express = require("express");
const app = express();
const port = 3000;

let memos = []; // サーバー側でメモを管理するデータ構造

// Middleware
app.use(express.json());
app.use(express.static("public")); // `public`ディレクトリを静的ファイルの提供に使用

// メモ一覧を取得
app.get("/memos", (req, res) => {
  res.json(memos);
});

// メモを追加
app.post("/memos", (req, res) => {
  const { text } = req.body;
  if (text) {
    memos.push(text);
    res.json({ success: true, memos });
  } else {
    res.status(400).json({ success: false, message: "Invalid memo text" });
  }
});

// メモを削除
app.post("/memos/delete", (req, res) => {
  const { index } = req.body;
  if (index >= 0 && index < memos.length) {
    memos.splice(index, 1);
    res.json({ success: true, memos });
  } else {
    res.status(400).json({ success: false, message: "Invalid index" });
  }
});

// サーバー起動
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
