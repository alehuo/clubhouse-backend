const min = (str: string, minLen: number): boolean => str.length > minLen;
const max = (str: string, maxLen: number): boolean => str.length < maxLen;
const minMax = (str: string, minLen: number, maxLen: number) =>
  min(str, minLen) && max(str, maxLen);
export default {
  validateStringLength: {
    min,
    max,
    minMax
  }
};
