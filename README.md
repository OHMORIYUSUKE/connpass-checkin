# connpass QR 受付

キーボード入力として読み取り結果を送信するQRコードリーダーで、参加者の受付票を読み取るアプリです。

## 起動

Node.js、npm、Python 3 が必要です。

```sh
npm start
```

同じ端末のブラウザで http://localhost:8080/ を開きます。

## 受付当日

1. リーダーを USB または Bluetooth で接続し、キーボード入力モードにします。
2. 同じブラウザでイベント管理者として connpass にログインします。
3. 受付タブを表示した状態で受付票を読み取ります。
4. 自動で開いた別タブで出席結果を確認します。
5. 受付タブに戻り、そのまま次のQRを読み取ります。

[connpass 公式ガイド](https://help.connpass.com/topics/event-attendee-qr-checkin)
