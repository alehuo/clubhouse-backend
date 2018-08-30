export interface IStatistics {
  newspostCount: number;
  messageCount: number;
  watchCount: number;
  userCount: number;
  hoursOnWatch: number;
  eventCount: number;
}

export const statisticsFilter: (stats: IStatistics) => IStatistics = (
  stats: IStatistics
): IStatistics => stats;
