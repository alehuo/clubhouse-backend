export interface ISession {
  sessionId?: number;
  userId?: number;
  startTime?: Date;
  endTime?: Date;
  startMessage?: string;
  endMessage?: string;
  started?: boolean;
  ended?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export const sessionFilter: (watch: ISession) => ISession = (
  session: ISession
): ISession => {
  if (!session.ended) {
    session.endTime = undefined;
  }
  if (!session.started) {
    session.startTime = undefined;
  }

  delete session.started;
  delete session.ended;

  return session;
};
