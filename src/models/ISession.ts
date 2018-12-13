import { Session } from "@alehuo/clubhouse-shared";

export const sessionFilter: (session: Session) => Session = (
  session: Session
): Session => {
  if (!session.ended) {
    delete session.endTime;
  }
  if (!session.started) {
    delete session.startTime;
  }

  delete session.started;
  delete session.ended;

  return session;
};
