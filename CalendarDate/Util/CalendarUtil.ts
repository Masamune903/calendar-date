import { DayIndex } from "../../DayIndex/DayIndex.ts";

type HasDayIndexRange = {
  readonly startDayIndex: DayIndex;
  readonly endDayIndex?: DayIndex;
}

export function getItemInRange<T extends HasDayIndexRange>(items: T[], dayIndex: DayIndex): T | undefined {
  return items.find(item => item.startDayIndex <= dayIndex && (item.endDayIndex == null || item.endDayIndex > dayIndex));
}

export function toHasDayIndexRange<T extends HasStartDayIndex>(items: T[]): HasDayIndexRange[] {
  let lastItem = items.at(-1);
  if (lastItem == null)
    return [];

  const nextItems = items.slice(0, -1).toReversed().map(item => {
      const next = {
        ...item,
        endDayIndex: item.endDayIndex ?? lastItem!.startDayIndex
      };
      lastItem = next;
      return next;
    }).toReversed();

  return [
    ...nextItems,
    lastItem
  ];
}

type HasStartDayIndex = {
  readonly startDayIndex: DayIndex;
  readonly endDayIndex?: DayIndex;
};