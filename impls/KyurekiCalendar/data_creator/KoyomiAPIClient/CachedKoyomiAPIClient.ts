import { KoyomiAPIClient, type KoyomiAPIDate } from "./KoyomiAPIClient.ts";

type CacheFile = {
  [year: string]: {
    [day: string]: KoyomiAPIDate;
  };
};

class CacheRepository {
  // readonly #cache = new Map<number, Map<string, KoyomiAPIDay>>();

  #cacheFilepath(year: number) {
    const years100 = Math.floor(year / 100) * 100;
    return `./impls/KyurekiCalendar/data_creator/KoyomiAPIClient/cache_data/cache-${years100}.json`;
  }

  async #load100YearsDaysFile(year: number) {
    const years100Cache = await this.#read100YearsDaysFile(year)
      .then((data) => JSON.parse(data || "{}") as CacheFile)
      .then((years) => new Map(
        Object.entries(years)
          .map(([year, days]) => [
            Number(year),
            new Map(Object.entries(days))
          ])
      ));

    return years100Cache;
  }

  async #read100YearsDaysFile(year: number) {
    try {
      return await Deno.readTextFile(this.#cacheFilepath(year));
    } catch {
      return null;
    }
  }

  async loadYearDays(year: number) {
    const years100 = await this.#load100YearsDaysFile(year);

    return years100.get(year);
  }

  async saveYearDays(year: number, days: Map<string, KoyomiAPIDate>) {
    const storedYears100Days = await this.#load100YearsDaysFile(year);
    const storedYearDays = storedYears100Days.get(year) || new Map();

    for (const [key, value] of days) {
      storedYearDays.set(key, value);
    }
    storedYears100Days.set(year, storedYearDays);

    const nextYears100Days: CacheFile = Object.fromEntries(
      [...storedYears100Days.entries()]
        .map(([year, days]) => [
          year,
          Object.fromEntries(
            [...days.entries()]
              .sort(([dayA], [dayB]) => dayA.localeCompare(dayB))
          )
        ] as const)
        .sort(([yearA], [yearB]) => yearA - yearB)
    );

    await Deno.writeTextFile(
      this.#cacheFilepath(year),
      JSON.stringify(nextYears100Days, null, 2)
    );
  }
}

export class CachedKoyomiAPIClient {
  readonly #client = new KoyomiAPIClient();
  readonly #cache = new CacheRepository();
  
  readonly #coolTime: number;
  #coolTimePromise: Promise<void> | undefined;

  constructor(coolTime: number) {
    this.#coolTime = coolTime;
  }


  async fetchYearDates(year: number) {
    const cached = await this.#cache.loadYearDays(year);
    if (cached) {
      return cached;
    }

    const resp = await this.#fetchYearDays(year);
    const yearDays = new Map(Object.entries(resp.datelist));
    this.#cache.saveYearDays(year, yearDays);

    return yearDays;
  }

  async #fetchYearDays(year: number) {
    try {
      await this.#coolTimePromise;
      return await this.#client.fetchYearDates(year);

    } catch (e) {
      throw e;

    } finally {
      this.#coolTimePromise = sleep(this.#coolTime);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
