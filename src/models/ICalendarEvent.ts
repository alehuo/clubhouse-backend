export default interface ICalendarEvent {
  eventId?: number;
  name: string;
  description: string;
  location: string | null;
  restricted: boolean;
  startTime: Date;
  endTime: Date;
  addedBy: number;
  unionId: number;
};
