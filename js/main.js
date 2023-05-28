//Web Speech APIの定義
const speech = new webkitSpeechRecognition();
//日本語の設定
speech.lang = 'ja-JP';

//要素を定義
const start_btn = document.getElementById("start_btn");
const end_btn = document.getElementById("end_btn");
const content = document.getElementById("content");


start_btn.addEventListener('click', function(){
    //音声認識をスタート
    speech.start();
});

//音声自動文字起こし機能
speech.onresult = function(e) {
    speech.stop();
    if(e.results[0].isFinal) {
        let autotext = e.results[0][0].transcript
        content.innerHTML += '<div>' + autotext + '</div>';
    }
}

speech.onend = () =>
{
    speech.start()
};