# 実装アイディア

## 利用イメージ

```ts
const isoDate = Temporal.PlainDate.from({ year: 2025, month: 8, day: 17 });

const date = JpEraDate.from(isoDate);
date.era


const kyurekiDate = JpOldDate.from();


```

## 実装イメージ

- DayIndex: ある一時を起点とし、そこからの日数（1年1月1日を dayIndex: 0 とする）で表された単一のスカラー（1次元ベクトル）

  ↓↑

- CalendarDate: DayIndex を特定の Calendar・特定の Era で解釈した時の年月日。

  - calendar: Calendar（月日を算出する方法）

  - era?: Era（年の表現方法）
