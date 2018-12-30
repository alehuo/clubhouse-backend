import moment from "moment";
import { dtFormat } from "../index";

// TODO: Deprecate

export const addTimestamps = (obj: any) => {
  const currentTimestamp = moment().format(dtFormat);
  if (obj.created_at) {
    obj.created_at = currentTimestamp;
  }
  if (obj.updated_at) {
    obj.created_at = currentTimestamp;
  }
};

export const updateOnUpdateTimestamp = (obj: any) => {
  const currentTimestamp = moment().format(dtFormat);
  if (obj.updated_at) {
    obj.created_at = currentTimestamp;
  }
};
