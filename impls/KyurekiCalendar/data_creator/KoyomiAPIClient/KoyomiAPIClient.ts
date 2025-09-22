/*
暦API(https://koyomi.zingsystem.com/) のクライアント
*/

/*
APIレスポンスの例

{
  "datelist": {
    "2001-09-01": {
      "week": "火",
      "inreki": "長月",
      "gengo": "平成",
      "wareki": 13,
      "zyusi": "丁",
      "zyunisi": "卯",
      "eto": "巳",
      "sekki": "",
      "kyurekiy": 2001,
      "kyurekim": 7,
      "kyurekid": 14,
      "rokuyou": "友引",
      "holiday": "",
      "hitotubuflg": false,
      "tensyabiflg": false,
      "daimyoubiflg": false
    },
    "2001-09-02": {
      "week": "金",
      "inreki": "長月",
      "gengo": "平成",
      "wareki": 13,
      "zyusi": "戊",
      "zyunisi": "辰",
      "eto": "巳",
      "sekki": "",
      "kyurekiy": 2001,
      "kyurekim": 7,
      "kyurekid": 15,
      "rokuyou": "先負",
      "holiday": "",
      "hitotubuflg": false,
      "tensyabiflg": false,
      "daimyoubiflg": false
    },
    "2001-09-03": {
      "week": "金",
      "inreki": "長月",
      "gengo": "平成",
      "wareki": 13,
      "zyusi": "己",
      "zyunisi": "巳",
      "eto": "巳",
      "sekki": "",
      "kyurekiy": 2001,
      "kyurekim": 7,
      "kyurekid": 16,
      "rokuyou": "仏滅",
      "holiday": "",
      "hitotubuflg": false,
      "tensyabiflg": false,
      "daimyoubiflg": true
    }
}
*/

export type KoyomiAPIResponse = {
  datelist: {
    /** キー: yyyy-mm-dd */
    [dateStr: string]: KoyomiAPIDate;
  };
};

export type KoyomiAPIDate = {
  /** 新暦の情報 */
  week: string;

  /** 和暦の情報 */
  /** 旧月名（睦月，如月，…） */
  inreki: string;

  /** 元号（平成など） */
  gengo: string;

  /** 和暦年（元号の年数） */
  wareki: number;
  
  /** 十干 */
  zyusi: string;
  
  /** 十二支 */
  zyunisi: string;
  
  /** 干支 */
  eto: string;
  
  /** 節気 */
  sekki: string;
  
  /** ==旧暦の情報== */
  /** 旧暦年 */
  kyurekiy: number;
  /** 旧暦月 */
  kyurekim: number;
  /** 旧暦日 */
  kyurekid: number;
  /** 六曜 */
  rokuyou: string;
  /** 祝日名（なければ空文字） */
  holiday: string;
  /** 一粒万倍日フラグ */
  hitotubuflg: boolean;
  /** 天赦日フラグ */
  tensyabiflg: boolean;
  /** 大明日フラグ */
  daimyoubiflg: boolean;
};

type KoyomiAPIErrorResponse = {
  readonly err: string;
  readonly msg: string;
};

/**
 * 暦API(https://koyomi.zingsystem.com/)のクライアント。
 * @deprecated キャッシュを使用しないため非推奨。 `CachedKoyomiAPIClient` の使用を推奨。
 */
export class KoyomiAPIClient {
  readonly #baseURL = "https://koyomi.zingsystem.com/api/";

  /** 1年間の日付情報を取得 */
  fetchYearDates(year: number) {
    return this.fetchMonthsDates(year, 1, 12);
  }

  /** 月間の日付情報を取得 */
  async fetchMonthsDates(startYear: number, startMonth: number, count: number) {
    const response = await fetch(`${this.#baseURL}?mode=m&cnt=${count}&targetyyyy=${startYear}&targetmm=${startMonth}&targetdd=1`);
    
    return this.#handleResponse(response);
  }

  /** 日間の日付情報を取得 */
  async fetchDates(startYear: number, startMonth: number, startDay: number, count: number) {
    const response = await fetch(`${this.#baseURL}?mode=d&cnt=${count}&targetyyyy=${startYear}&targetmm=${startMonth}&targetdd=${startDay}`);

    return this.#handleResponse(response);
  }

  /**
   * レスポンスの処理
   * @param response 
   * @returns 正常なレスポンスデータ
   * @throws エラーレスポンス
   */
  async #handleResponse(response: Response) {
    const responseData: KoyomiAPIResponse | KoyomiAPIErrorResponse = await response.json();

    if ("err" in responseData) {
      throw new Error(`${responseData.err}: ${responseData.msg}`);
    }

    return responseData;
  }
}
