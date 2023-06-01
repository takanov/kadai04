//Web Speech APIの定義
const speech = new webkitSpeechRecognition();
//日本語の設定
speech.lang = 'ja-JP';

//要素を定義
const start_btn = document.getElementById("start_btn");
const end_btn = document.getElementById("end_btn");
const content = document.getElementById("memo");
const time = document.getElementById("key");
const date = new Date();

// YYYY/MM/DD形式の文字列に変換する関数
function formatDate(date) {
    const yyyy = String(date.getFullYear());
    // Stringの`padStart`メソッド（ES2017）で2桁になるように0埋めする
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
}


console.log(formatDate(date)); // => "2006/01/02"


start_btn.addEventListener('click', function(){
    //音声認識をスタート
    speech.start();
});



$("#save").on('click', function(){
    //入力された文字を取得したいと思います
    const key = $("#key").text();
    console.log(key,'keyの中身');

    //textareaの入力箇所も取得
    const value = $("#memo").val();
    console.log(value, 'valueの中身');

    //ローカルストレージに保存する
    localStorage.setItem(key, value);

    const html = `
        <tr>
            <th>${key}</th>
            <td>${value}</td>
        </tr>

    `// テンプレートリテラル
    $("#list").append(html);
    $("#key").text("");
    $("#memo").val("");
})




//音声自動文字起こし機能
speech.onresult = function(e) {
    speech.stop();
    if(e.results[0].isFinal) {
        let autotext = e.results[0][0].transcript;
        content.innerHTML +=  autotext;
        time.innerHTML += formatDate(date);
    }
}

speech.onend = () =>
{
    speech.start()
};



//タスク管理ボード

const defaultBoards = [
//タスク
    {
        "id": "sample-board-1",
        "title": "タスク",
        "item": [
            { "title": "報告書の作成" },
            { "title": "14時から打ち合わせ" }
        ]
    },
    //進行中
    {
        "id": "sample-board-2",
        "title": "進行中",
        "item": [{ "title": "○○案の企画書作成" }]
    },
    //完了
    {
        "id": "sample-board-3",
        "title": "完了",
        "item": [{ "title": "日報の提出" }]
    }
];




const kanban = new jKanban({
    element:'#myKanban', //タスク管理ボードを表示させたいhtml要素
    gutter: '15px', //ボード同士の間隔
    widthBoard: '250px', //ボードサイズ
    boards: defaultBoards, //初期状態のボードの中身をJSONで指定
    itemAddOptions: {
        enabled: true,                                              // add a button to board for easy item creation
        content: '+',                                                // text or html content of the board button   
        class: 'kanban-title-button btn btn-default btn-xs',         // default class of the button
        footer: false                                                // position the button on footer
    },    
    //buttonClick : (elem, id) => addFormElement(id);
});




//   let removeBoard = document.getElementById("removeBoard");
//   removeBoard.addEventListener("click", function() {
//     KanbanTest.removeBoard("_done");
//   });

//   let removeElement = document.getElementById("removeElement");
//   removeElement.addEventListener("click", function() {
//     KanbanTest.removeElement("_test_delete");
//   });

//   let allEle = KanbanTest.getBoardElements("_todo");
//   allEle.forEach(function(item, index) {
//     //console.log(item);
//   });