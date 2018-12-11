import { Session } from "@alehuo/clubhouse-shared";

export const sessionFilter: (session: Session) => Session = (
  session: Session
): Session => {
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
