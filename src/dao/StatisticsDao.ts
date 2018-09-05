import * as Knex from "knex";
import { IStatistics } from "../models/IStatistics";
import { IUserStatistics } from "../models/IUserStatistics";
import IDao from "./Dao";

export default class StatisticsDao implements IDao<IStatistics> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IStatistics[]> {
    throw new Error("Not implemented");
  }

  public findStatistics(): Promise<IStatistics[]> {
    return Promise.resolve(
      this.knex.raw(
        "SELECT (SELECT COUNT(*) from users) AS userCount, " +
          "(SELECT COUNT(*) from calendarEvents) AS eventCount, " +
          "(SELECT COUNT(*) from newsposts) AS newspostCount, " +
          "(SELECT COALESCE(SUM((endTime - startTime) / (1000.0 * 60 * 60)),0)" +
          " FROM watches WHERE endTime is NOT NULL) AS hoursOnWatch, " +
          "(SELECT COUNT(messageId) from messages) AS messageCount FROM users LIMIT 1;"
      )
    );
  }

  public findStatisticsFromUser(userId: number): Promise<IUserStatistics[]> {
    return Promise.resolve(
      this.knex.raw(
        "SELECT (SELECT COUNT(*) from calendarEvents WHERE addedBy = :userId) AS eventCount, " +
          "(SELECT COUNT(*) from newsposts WHERE author = :userId) AS newspostCount, " +
          "(SELECT COALESCE(SUM((endTime - startTime) / (1000.0 * 60 * 60)),0)" +
          " FROM watches WHERE endTime is NOT NULL AND userId = :userId) AS hoursOnWatch, " +
          "(SELECT COUNT(*) from watches WHERE userId = :userId) AS watchCount, " +
          "(SELECT COUNT(messageId) from messages WHERE userId = :userId ) AS messageCount FROM users LIMIT 1;",
        { userId }
      )
    );
  }

  public findOne(statisticsId: number): Promise<IStatistics> {
    throw new Error("Not implemented");
  }

  public save(statistics: IStatistics): Promise<number[]> {
    throw new Error("Not implemented");
  }

  public remove(locationId: number): Promise<boolean> {
    throw new Error("Not implemented");
  }
}
