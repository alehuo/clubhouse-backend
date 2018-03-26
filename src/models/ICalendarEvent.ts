export default interface ICalendarEvent {
  eventId?: number;
  name: string;
  description: string;
  restricted: boolean;
  startTime: string | Date;
  endTime: string | Date;
  addedBy: number;
  unionId: number;
};
