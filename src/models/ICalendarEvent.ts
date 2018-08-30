export interface ICalendarEvent {
  eventId?: number;
  name: string;
  description: string;
  locationId: number | null;
  restricted: boolean;
  startTime: Date;
  endTime: Date;
  addedBy: number;
  unionId: number;
  created_at?: Date;
  updated_at?: Date;
};
