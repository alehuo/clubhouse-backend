export default interface IMessage {
  messageId?: number;
  userId: number;
  message: string;
  created_at?: Date;
  updated_at?: Date;
}
