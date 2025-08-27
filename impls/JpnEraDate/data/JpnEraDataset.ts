import { ISOCalendarDate } from "../../ISOCalendarDate/ISOCalendarDate.ts";
import { JpnEra, type JpnEraInfo } from "../JpnEraDate.ts";

export const JPN_ERA_DATASET: JpnEraInfo[] = [{
  era: new JpnEra("reiwa", "令和"),
  startDate: ISOCalendarDate.from([2019, 5, 1]),
}, {
  era: new JpnEra("heisei", "平成"),
  startDate: ISOCalendarDate.from([1989, 1, 1]),
}, {
  era: new JpnEra("showa", "昭和"),
  startDate: ISOCalendarDate.from([1926, 12, 25]),
}, {
  era: new JpnEra("taisho", "大正"),
  startDate: ISOCalendarDate.from([1912, 7, 30]),
}, {
  era: new JpnEra("meiji", "明治"),
  startDate: ISOCalendarDate.from([1868, 1, 25])
}];