import moment from "moment";

export const addTimestamps = (obj: any) => {
  const currentTimestamp = moment().toISOString();
  if (obj.created_at) {
    obj.created_at = currentTimestamp;
  }
  if (obj.updated_at) {
    obj.created_at = currentTimestamp;
  }
};

export const updateOnUpdateTimestamp = (obj: any) => {
  const currentTimestamp = moment().toISOString();
  if (obj.updated_at) {
    obj.created_at = currentTimestamp;
  }
};
