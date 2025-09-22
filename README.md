
# calendar-date

## 概要

日本の和暦（元号）や旧暦、ISO暦など複数の暦体系に対応した日付計算ライブラリです。Deno/TypeScript環境向けに設計されており、日付の型安全な扱いや暦変換、日付範囲・期間計算などをサポートします。

## 主な機能

- ISO暦
- 日本の旧暦（天保暦）
  ※ 1800～2199年
- 各暦の日付の変換

## ディレクトリ構成

- `CalendarDate/` ... 暦・日付型の定義
- `DayIndex/` ... 日付インデックス型
- `impls/ISOCalendarDate/` ... ISO暦の実装例
- `impls/JpnEraDate/` ... 和暦（元号）実装
- `impls/KyurekiCalendar/` ... 旧暦実装

## インストール

Denoの場合:

```sh
deno add @amgm-masamune/japanese-date
```

## 使い方

```ts
import { ISOCalendarDate } from "@amgm-masamune/japanese-date";

// ISO暦の日付を作成
const date = ISOCalendarDate

```

## ライセンス

MIT License
