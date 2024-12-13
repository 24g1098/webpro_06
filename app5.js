const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = '勝ち';
  if((num==1&&hand=='チョキ')||(num==2&&hand=='パー')||(num==3&&hand=='グー'))
    judgement = '負け';
  
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});


app.get("/nazo", (req, res) => {
  // クエリパラメータから必要な情報を取得（初期値を0に設定）
  let kotae = req.query.kotae;
  let seikai = Number(req.query.seikai) || 0;
  let total = Number(req.query.total) || 0;

  console.log({ kotae, seikai, total});

  // 5回目の問題が終了した後は終了メッセージを表示
  if (total >= 5) {
    return res.render('nazo', {
      cpu: '',  // 問題文を表示しない
      your: kotae,
      judgement: '終了',
      seikai,
      total,
      comment: 'これで終了です！もう一度挑戦してみてください！',
    });
  }

  // ランダムに問題を選ぶ
  const num = Math.floor(Math.random() * 10 + 1);
  let cpu = '';

  if (num == 1) cpu = '花束が2束と3束あります。合わせると何束になる？(数字で)';
  else if (num == 2) cpu = 'アルファベットの最初の文字はA。では最後の文字は？';
  else if (num == 3) cpu = '孫がおじいちゃんとボール遊びをしました。なにをした？（カタカナで）';
  else if (num == 4) cpu = '50を半分で割り、10を足します。いくつになる？(数字で)';
  else if (num == 5) cpu = '答えは簡単です。1×2×5×10×0の答えはなに？';
  else if (num == 6) cpu = 'いま、なんじ？(ひらがなで「~じ」と答えて)';
  else if (num == 7) cpu = 'たった1枚のお札を10枚のお札と交換しました。どうやった？（名詞をひらがなで）';
  else if (num == 8) cpu = 'Jの隣にいるえらい女性は誰？（アルファベットで答えて）';
  else if (num == 9) cpu = '「さんかく」なのに「しかく」なものは？';
  else if (num == 10) cpu = '魚屋さんに魚が5匹。野良猫が1匹くわえていったら何匹になった？(数字で)';

  let judgement = '不正解';

  // 正解判定
  if ((num == 1 && (kotae == '1' || kotae == '１'))
    || (num == 2 && (kotae == 't' || kotae == 'ｔ'))
    || (num == 3 && kotae == 'ソフトボール')
    || (num == 4 && (kotae == '12' || kotae == '１２'))
    || (num == 5 && kotae == '簡単')
    || (num == 6 && kotae == 'にじ')
    || (num == 7 && kotae == 'りょうがえ')
    || (num == 8 && kotae == 'Q')
    || (num == 9 && kotae == '口')
    || (num == 10 && (kotae == '６' || kotae == '6'))) {
    judgement = '正解';
    seikai += 1;
  } 
  total += 1;

  

  // レンダリング
  res.render('nazo', {
    cpu,
    your: kotae,
    judgement,
    seikai,
    total,
    comment:null
  });
});

app.get("/gatya", (req, res) => {
  const num = Math.floor(Math.random() * 1000 + 1); // 1から1000のランダムな数を生成
  const numm = Math.floor(Math.random() * 2 + 1); // 1か2をランダムに選択
  let gty = '';
  let fes = '';

  // numm が 1 の場合（1回目）
  if (numm == 1) { fes = 'ガチャ開催中'
    if (num == 1) {gty = 'ssr'; } 
    else if (num >= 2 && num <= 101) gty = 'sr';
    else if (num >= 102 && num <= 503) gty = 'r';
    else if (num >= 504 && num <= 1000) gty = 'n';
  }
  
  // numm が 2 の場合（2回目）
  else if (numm == 2) { fes = 'フェス開催中！大当たり確率２倍でした！';
    if (num >= 1 && num <= 10) luck = 'ssr';
    else if (num >= 11 && num <= 201) gty = 'sr';
    else if (num >= 202 && num <= 503) gty = 'r';
    else if (num >= 504 && num <= 1000) gty = 'n';
  }

  console.log('今回のレアリティは' + gty + 'です');
  
  // luckとnumをテンプレートに渡して表示
  res.render('gatya', { number: num, gty: gty ,numm: numm ,fes: fes});
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));
//ejsはサイトから変数来るhtmlは固定

// ## ファイル一覧
// ```mermaid
// flowchart TD;

// start["開始"];
// end1["終了"]
// if{"条件に合うか"}
// win["勝ち"]
// loose["負け"]

// start --> if
// if -->|yes| win
// win --> end1
// if -->|no| loose
// loose --> start
// ```

// ファイル名 | 説明
// -|-
// app5.js | プログラム本体
// public/janken.html | じゃんけんの開始画面