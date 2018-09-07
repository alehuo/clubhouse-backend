export interface IMessage {
  messageId?: number;
  userId: number;
  title?: string;
  message: string;
  created_at?: Date;
  updated_at?: Date;
}

export const messageFilter: (message: IMessage) => IMessage = (
  message: IMessage
): IMessage => message;
