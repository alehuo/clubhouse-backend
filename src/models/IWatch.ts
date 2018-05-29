export default interface IWatch {
  watchId?: number;
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

export const watchFilter = (watch: IWatch) => {
  if (!watch.ended) {
    watch.endTime = null;
  }
  if (!watch.started) {
    watch.startTime = null;
  }

  delete watch.started;
  delete watch.ended;

  return watch;
};
