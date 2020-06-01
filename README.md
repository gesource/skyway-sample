# skyway-sample
SkyWayのJavaScript SDKの動作確認用。

SkeyWayのチュートリアルを修正した。

## 使い方
script.jsのAPI_KEYにSkyWayのAPIキーを設定する。

## 修正点

* PeerIDをQRコードで表示して、入力の負担を減らす。
* iPhoneで音声が出なかったので修正した。
  * 相手の音声はaudioタグで出力する。
  * 先にaudioContextを生成してから、UserMediaを生成する
