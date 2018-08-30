export interface IMessage {
  messageId?: number;
  userId: number;
  message: string;
  created_at?: Date;
  updated_at?: Date;
}

export const messageFilter: (message: IMessage) => IMessage = (
  message: IMessage
): IMessage => message;
