'use strict';

const API_KEY = 'ここにAPIキーを入力する';
let localStream = null;
let peer = null;
let existingCall = null;


// safariで Web Audio APIを動かすため、先にaudioContextを生成してから、UserMediaを生成する
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// カメラ映像、マイク音声の取得
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function (stream) {
        // Succes
        // $('#my-video').get(0).srcObject = stream;
        document.getElementById('my-video').srcObject = stream;
        localStream = stream;
    }).catch(function (error) {
        // Error
        console.log('mediaDevice.getUserMedia() error:', error);
        alert(error);
        return;
    });

// Peerオブジェクトの作成
peer = new Peer({
    key: API_KEY,
    debug: 3,
});
// シグナリングサーバと接続し、利用する準備が整った
peer.on('open', function () {
    $('#my-id').text(peer.id);
});
// 何らかのエラーが発生した
peer.on('error', function (err) {
    alert(err.message);
});
// Peer(相手)との接続が切れた
peer.on('close', function () {
    console.log('close');
});
// シグナリングサーバとの接続が切れた
peer.on('disconnected', function () {
    console.log('disconnected');
});

// 発信処理
$('#make-call').submit(function (e) {
    e.preventDefault;
    const call = peer.call($('#callto-id').val(), localStream);
    setupCallEventHandlers(call);
    return false;
});
// 切断処理
$('#end-call').click(function () {
    existingCall.close();
});
// 着信処理
peer.on('call', function (call) {
    call.answer(localStream);
    setupCallEventHandlers(call);
});

function setupCallEventHandlers(call) {
    // すでに接続中の場合は一旦既存の接続を切断し、あとから来た接続要求を優先する
    if (existingCall) {
        existingCall.close();
    }
    existingCall = call;

    // 相手のカメラ映像・マイク音声を受信した
    call.on('stream', function (stream) {
        addVideo(call, stream);
        setupEndCallUI();
        $('#their-id').text(call.remoteId);
    });

    // call.close()による切断処理が実行され、実際に切断された
    call.on('close', function () {
        removeVideo(call.remoteId);
        setupMakeCallUI();
    });
}

// video要素の再生
function addVideo(call, stream) {
    console.log('addVideo');
    $('#their-video').get(0).muted = true;
    $('#their-video').get(0).srcObject = stream;
    $('#their-audio').get(0).autoplay = true;
    $('#their-audio').get(0).srcObject = stream;
}

// video要素の削除
function removeVideo(peerId) {
    $('#their-video').get(0).srcObject = undefined;
}

// ボタンの表示、非表示切り替え
function setupMakeCallUI() {
    $('#make-call').show();
    $('#end-call').hide();
}

function setupEndCallUI() {
    $('#make-call').hide();
    $('#end-call').show();
}
