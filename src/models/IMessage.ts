export default interface IMessage {
  messageId?: number;
  timestamp: Date;
  userId: number;
  message: string;
}
