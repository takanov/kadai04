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
    $("#key").val("");
    $("#memo").val("");
})




//音声自動文字起こし機能
speech.onresult = function(e) {
    speech.stop();
    if(e.results[0].isFinal) {
        let autotext = e.results[0][0].transcript
        content.innerHTML +=  autotext;
        time.innerHTML += formatDate(date);
    }
}

speech.onend = () =>
{
    speech.start()
};