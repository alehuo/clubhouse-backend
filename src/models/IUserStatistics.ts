export interface IUserStatistics {
  newspostCount: number;
  messageCount: number;
  watchCount: number;
  hoursOnWatch: number;
  eventCount: number;
}

export const userStatisticsFilter: (
  stats: IUserStatistics
) => IUserStatistics = (stats: IUserStatistics): IUserStatistics => stats;
