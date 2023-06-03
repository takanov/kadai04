// //Web Speech APIの定義
// const speech = new webkitSpeechRecognition();
// //日本語の設定
// speech.lang = 'ja-JP';

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


// console.log(formatDate(date)); // => "2006/01/02"


// start_btn.addEventListener('click', function(){
//     //音声認識をスタート
//     speech.start();
// });



// $("#save").on('click', function(){
//     //入力された文字を取得したいと思います
//     const key = $("#key").text();
//     console.log(key,'keyの中身');

//     //textareaの入力箇所も取得
//     const value = $("#memo").val();
//     console.log(value, 'valueの中身');

//     //ローカルストレージに保存する
//     localStorage.setItem(key, value);

//     const html = `
//         <tr>
//             <th>${key}</th>
//             <td>${value}</td>
//         </tr>

//     `// テンプレートリテラル
//     $("#list").append(html);
//     $("#key").text("");
//     $("#memo").val("");
// })




// //音声自動文字起こし機能
// speech.onresult = function(e) {
//     speech.stop();
//     if(e.results[0].isFinal) {
//         let autotext = e.results[0][0].transcript;
//         content.innerHTML +=  autotext;
//         time.innerHTML += formatDate(date);
//     }
// }

// speech.onend = () =>
// {
//     speech.start()
// };



//タスク管理ボードの初期データ
const defaultBoards = [
//タスク
    {
        "id": "todo",
        "title": "タスク",
        "class": "task",
        "item": [
            { "title": "やることを入力" },
        ]
    },
    //進行中
    {
        "id": "working",
        "title": "進行中",
        "class": "progress",
        "item": [{ "title": "進行中のものを入力" }]
    },
    //完了
    {
        "id": "done",
        "title": "完了",
        "class": "done",
        "item": [{ "title": "完了したものを入力" }]
    }
];

let kanban;
// ページ読み込み時にローカルストレージからボードの状態を復元
const savedData = localStorage.getItem(formatDate(date));
if (savedData) {
    const parsedData = JSON.parse(savedData);
    // 復元したデータを用いてkanbanオブジェクトを作成
    kanban = new jKanban({
        element:'#myKanban', //タスク管理ボードを表示させたいhtml要素
        gutter: '15px', //ボード同士の間隔
        widthBoard: '250px', //ボードサイズ
        boards: [
            { id: 'todo', title: 'タスク', class: 'task', item: parsedData.todo },
            { id: 'working', title: '進行中', class: 'progress', item: parsedData.working },
            { id: 'done', title: '完了', class: 'done', item: parsedData.done },
        ],
        itemAddOptions: {
            enabled: true,                                              //  ボードにボタンを追加し、アイテム作成が簡単にできるようにする
            content: '+',                                                // ボードボタンのテキストまたはhtmlコンテンツ  
            class: 'kanban-title-button btn btn-default btn-xs',         // ボタンのデフォルトクラス
            footer: false                                                // ボタンをフッターに配置する
        },  
        buttonClick : (el, boardId) => addFormElement(boardId),
        //要素を削除
        click: (el) => kanban.removeElement(el),
    });
} else {
    kanban = new jKanban({
    element:'#myKanban', //タスク管理ボードを表示させたいhtml要素
    gutter: '15px', //ボード同士の間隔
    widthBoard: '250px', //ボードサイズ
    boards: defaultBoards, //
    itemAddOptions: {
        enabled: true,                                              //  ボードにボタンを追加し、アイテム作成が簡単にできるようにする
        content: '+',                                                // ボードボタンのテキストまたはhtmlコンテンツ  
        class: 'kanban-title-button btn btn-default btn-xs',         // ボタンのデフォルトクラス
        footer: false                                                // ボタンをフッターに配置する
    },  
    buttonClick : (el, boardId) => addFormElement(boardId),
    //要素を削除
    click: (el) => kanban.removeElement(el),
    
});
}



function addFormElement(boardId) {
    const formItem = document.createElement('form');
    formItem.setAttribute("class", "itemform");
    formItem.innerHTML = '<div class="form-group"><textarea class="form-control" rows="2"></textarea></div><div class="form-group"><button type="submit" class="btn btn-primary btn-xs pull-right">Submit</button><button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Cancel</button></div>';

    kanban.addForm(boardId, formItem);
    formItem.addEventListener('submit', (e) => {
        e.preventDefault();
        
        //入力された「タスク」をボードに登録
        kanban.addElement(boardId, {"title": e.target[0].value});
        
        //フォーム要素を非表示にするため削除
        formItem.parentNode.removeChild(formItem);
        saveBoardState();
      });
      document.getElementById("CancelBtn").onclick = function() {
        formItem.parentNode.removeChild(formItem);
      };
}


//ボードの状態を保存
function saveBoardState() {
    const boardData = {
        todo: Array.from(kanban.getBoardElements('todo')).map(el => ({ title: el.innerText })),
        working: Array.from(kanban.getBoardElements('working')).map(el => ({ title: el.innerText })),
        done: Array.from(kanban.getBoardElements('done')).map(el => ({ title: el.innerText })),
    };
    console.log('Saving board data:', boardData);
    localStorage.setItem(formatDate(date), JSON.stringify(boardData));
}

$(kanban).on('elementDragend', (el) => {
    saveBoardState();
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